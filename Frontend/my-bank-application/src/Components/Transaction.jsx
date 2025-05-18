import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/Transaction.css';

const TransactionPage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    receiverAccountNumber: '',
    amount: '',
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.username) {
          const response = await axios.get(`http://localhost:8080/customer/details/${storedUser.username}`);
          setUser(response.data);
        } else {
          setResponseMessage('Please log in to initiate transactions.');
        }
      } catch (error) {
        setResponseMessage('Error fetching user details. Please try again.');
        console.error('Error fetching user details:', error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async () => {
    if (!formData.receiverAccountNumber || !formData.amount) {
      setResponseMessage('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      await axios.post(`http://localhost:8080/transaction/transfer/${storedUser.username}`, formData);
      setResponseMessage('Transaction successful!');
      setFormData({ receiverAccountNumber: '', amount: '' });
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
        <h1 className="text-center mb-4">Initiate Transaction</h1>

        {/* Navigation Buttons */}
        <div className="navigation-buttons d-flex justify-content-between mb-4">
          <button className="btn btn-secondary" disabled>
            Back
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/beneficiary-transaction')}>
            Transfer to Beneficiary
          </button>
        </div>

        {user && (
          <div className="user-info bg-light p-3 rounded shadow-sm mb-4">
            <h5 className="text-primary">Your Details:</h5>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Account Number:</strong> {user.accountNumber}</p>
            <p><strong>Balance:</strong> ₹{user.balance}</p>
          </div>
        )}

        <div className="transaction-form bg-white p-4 rounded shadow-sm">
          <div className="form-group mb-3">
            <label htmlFor="receiverAccountNumber" className="form-label">Receiver Account Number:</label>
            <input
              type="text"
              id="receiverAccountNumber"
              className="form-control"
              value={formData.receiverAccountNumber}
              onChange={handleChange}
              placeholder="Enter Receiver's Account Number"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="amount" className="form-label">Amount:</label>
            <input
              type="number"
              id="amount"
              className="form-control"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter Amount"
              required
            />
          </div>
          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={() => setShowModal(true)}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </div>

        {responseMessage && (
          <div className={`alert mt-3 text-center ${responseMessage.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
            {responseMessage}
          </div>
        )}

        {showModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Transaction</h5>
                </div>
                <div className="modal-body text-center">
                  <p>
                    Are you sure you want to transfer ₹{formData.amount} to account {formData.receiverAccountNumber}?
                  </p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleSubmit}>
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

export default TransactionPage;
