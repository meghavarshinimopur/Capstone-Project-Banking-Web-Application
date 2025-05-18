import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/Beneficiary.css';

const AddBeneficiary = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [beneficiaryDetails, setBeneficiaryDetails] = useState(null);
  const [maxTransferLimit, setMaxTransferLimit] = useState('');
  const [user, setUser] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch logged-in user details on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.username) {
          const response = await axios.get(`http://localhost:8080/customer/details/${storedUser.username}`);
          setUser(response.data); // Set user details
        } else {
          setResponseMessage('Please log in to add beneficiaries.');
        }
      } catch (error) {
        setResponseMessage('Error validating user. Please log in again.');
        console.error('Error fetching user details:', error);
      }
    };
    fetchUser();
  }, []);

  // Fetch beneficiary details based on the entered account number
  const fetchBeneficiaryDetails = async () => {
    if (!accountNumber) {
      setResponseMessage('Please enter an account number.');
      return;
    }

    setIsLoading(true); // Show loading while fetching details
    try {
      const response = await axios.get(`http://localhost:8080/customer/details/account/${accountNumber}`);
      setBeneficiaryDetails(response.data);
      setResponseMessage('');
    } catch (error) {
      setBeneficiaryDetails(null);
      if (error.response && error.response.status === 404) {
        setResponseMessage('Beneficiary account not found.');
      } else {
        setResponseMessage('Error fetching beneficiary details.');
      }
      console.error('Error fetching beneficiary details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add beneficiary with entered max transfer limit
  const addBeneficiary = async () => {
    if (!beneficiaryDetails || !maxTransferLimit) {
      setResponseMessage('Please fetch beneficiary details and enter the transfer limit.');
      return;
    }

    setIsLoading(true); // Show loading during API call
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.username) {
        const requestBody = {
          accountNumber: beneficiaryDetails.accountNumber,
          maxTransferLimit,
        };
        await axios.post(`http://localhost:8080/beneficiary/add/${storedUser.username}`, requestBody);
        setResponseMessage('Beneficiary added successfully!');
        setAccountNumber('');
        setBeneficiaryDetails(null);
        setMaxTransferLimit('');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setResponseMessage(error.response.data); // Display specific API error
      } else {
        setResponseMessage('Error adding beneficiary.');
      }
      console.error('Error adding beneficiary:', error);
    } finally {
      setIsLoading(false); // Hide loading
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container beneficiary-container flex-grow-1">
        <h1 className="text-center mb-4">Add Beneficiary</h1>

        {/* Navigation Buttons */}
        <div className="navigation-buttons d-flex justify-content-between mb-4">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Back
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/manage-beneficiary')}>
            View Beneficiaries
          </button>
        </div>

        {/* Logged-in User Details */}
        {user && (
          <div className="user-info bg-light p-3 rounded shadow-sm mb-4">
            <h5 className="text-primary">Your Details:</h5>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Account Number:</strong> {user.accountNumber}</p>
          </div>
        )}

        {/* Beneficiary Addition Form */}
        <div className="beneficiary-form bg-white p-4 rounded shadow-sm">
          <div className="form-group">
            <input
              type="text"
              id="accountNumber"
              className="form-control"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter Beneficiary Account Number"
              required
            />
            <button
              className="btn-inline btn-primary"
              onClick={fetchBeneficiaryDetails}
              disabled={isLoading}
            >
              {isLoading ? 'Fetching...' : 'Fetch'}
            </button>
          </div>

          {/* Display Beneficiary Details if available */}
          {beneficiaryDetails && (
            <div className="beneficiary-details bg-light p-3 rounded shadow-sm mb-3">
              <h5 className="text-success">Beneficiary Details:</h5>
              <p><strong>Name:</strong> {beneficiaryDetails.fullName}</p>
              <p><strong>Bank:</strong> {beneficiaryDetails.bankName}</p>
            </div>
          )}

          {/* Enter Max Transfer Limit */}
          {beneficiaryDetails && (
            <div className="mb-3">
              <label htmlFor="maxTransferLimit" className="form-label">Maximum Transfer Limit:</label>
              <input
                type="number"
                id="maxTransferLimit"
                className="form-control"
                value={maxTransferLimit}
                onChange={(e) => setMaxTransferLimit(e.target.value)}
                placeholder="Enter Max Transfer Limit"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          {beneficiaryDetails && (
            <button
              className="btn btn-success w-100"
              onClick={addBeneficiary}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Beneficiary'}
            </button>
          )}
        </div>

        {/* Response Message */}
        {responseMessage && (
          <div className={`alert mt-3 text-center ${responseMessage.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
            {responseMessage}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AddBeneficiary;
