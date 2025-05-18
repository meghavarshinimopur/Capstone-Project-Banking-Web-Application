import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/Transaction.css';

const BeneficiaryTransactionPage = () => {
  const [user, setUser] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [amount, setAmount] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch the user and beneficiaries when the page loads
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch logged-in user details
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.username) {
          const userResponse = await axios.get(`http://localhost:8080/customer/details/${storedUser.username}`);
          setUser(userResponse.data);

          // Fetch beneficiaries for the user
          const beneficiaryResponse = await axios.get(`http://localhost:8080/beneficiary/${storedUser.username}/all`);
          setBeneficiaries(beneficiaryResponse.data);
        } else {
          setResponseMessage('Please log in to view your beneficiaries.');
        }
      } catch (error) {
        setResponseMessage('Error fetching details. Please try again.');
        console.error('Error:', error);
      }
    };
    fetchDetails();
  }, []);

  const handleBeneficiaryChange = (e) => {
    const selectedId = e.target.value;
    const beneficiary = beneficiaries.find((b) => b.id.toString() === selectedId);
    setSelectedBeneficiary(beneficiary);
  };

  const handleTransaction = async () => {
    if (!selectedBeneficiary || !amount) {
      setResponseMessage('Please select a beneficiary and enter the amount.');
      return;
    }

    setIsLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const payload = {
        receiverAccountNumber: selectedBeneficiary.accountNumber,
        amount,
      };
      await axios.post(`http://localhost:8080/transaction/transfer/${storedUser.username}`, payload);
      setResponseMessage('Transaction successful!');
      setAmount('');
      setSelectedBeneficiary(null); // Reset form after success
    } catch (error) {
      setResponseMessage(
        error.response && error.response.data ? error.response.data : 'Error processing transaction.'
      );
      console.error('Error processing transaction:', error);
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container transaction-container flex-grow-1">
        <h1 className="text-center mb-4">Transfer to Beneficiary</h1>

        {/* User Details */}
        {user && (
          <div className="user-info bg-light p-3 rounded shadow-sm mb-4">
            <h5 className="text-primary">Your Details:</h5>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Account Number:</strong> {user.accountNumber}</p>
            <p><strong>Balance:</strong> ₹{user.balance}</p>
          </div>
        )}

        

        {/* Beneficiary Details */}
        {selectedBeneficiary && (
          <div className="beneficiary-info bg-light p-3 rounded shadow-sm mb-4">
            <h5 className="text-primary">Beneficiary Details:</h5>
            <p><strong>Name:</strong> {selectedBeneficiary.name}</p>
            <p><strong>Account Number:</strong> {selectedBeneficiary.accountNumber}</p>
            <p><strong>Max Transfer Limit:</strong> ₹{selectedBeneficiary.maxTransferLimit}</p>
          </div>
        )}

        {/* Transaction Form */}
        <div className="transaction-form bg-white p-4 rounded shadow-sm">
          <div className="form-group mb-3">
            <label htmlFor="beneficiary" className="form-label">Select Beneficiary:</label>
            <select
              id="beneficiary"
              className="form-control"
              onChange={handleBeneficiaryChange}
              value={selectedBeneficiary ? selectedBeneficiary.id : ''}
            >
              <option value="">-- Select Beneficiary --</option>
              {beneficiaries.map((beneficiary) => (
                <option key={beneficiary.id} value={beneficiary.id}>
                  {beneficiary.name} (₹{beneficiary.maxTransferLimit})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="amount" className="form-label">Amount:</label>
            <input
              type="number"
              id="amount"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Amount"
            />
          </div>
          <button
            className="btn btn-primary w-100"
            onClick={() => setShowModal(true)}
            disabled={!selectedBeneficiary || !amount || isLoading}
          >
            Initiate Transaction
          </button>
        </div>

        {/* Response Messages */}
        {responseMessage && (
          <div className={`alert mt-3 text-center ${responseMessage.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
            {responseMessage}
          </div>
        )}

        {/* Confirmation Modal */}
        {showModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Transaction</h5>
                </div>
                <div className="modal-body text-center">
                  <p>
                    Are you sure you want to transfer ₹{amount} to {selectedBeneficiary.name} (Account: {selectedBeneficiary.accountNumber})?
                  </p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleTransaction}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BeneficiaryTransactionPage;
