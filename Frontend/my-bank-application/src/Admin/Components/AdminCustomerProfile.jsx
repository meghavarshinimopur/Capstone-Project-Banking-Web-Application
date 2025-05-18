import React, { useState } from 'react';
import AdminNavbar from './AdminNavbar'; // Admin Navbar
import Footer from '../../Components/Footer'; // Footer Component
import axios from 'axios';
import '../css/AdminCustomerProfile.css'; // Custom CSS for styling

const AdminCustomerProfile = () => {
  const [searchAccountNumber, setSearchAccountNumber] = useState('');
  const [customerProfile, setCustomerProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async () => {
    try {
      const adminUsername = JSON.parse(localStorage.getItem('admin')).username; // Fetch Admin username
      const response = await axios.get(
        `http://localhost:8080/admin/customer-profile/by-account/${searchAccountNumber}`,
        { headers: { 'Admin-Username': adminUsername } }
      );
      setCustomerProfile(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching customer profile:', error);
      setErrorMessage(
        error.response?.data || 'An error occurred while fetching the customer profile.'
      );
      setCustomerProfile(null);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="profile-container1">
        <h2>Search Customer Profile</h2>

        {/* Search Bar */}
        <div className="search-bar mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Account Number"
            value={searchAccountNumber}
            onChange={(e) => setSearchAccountNumber(e.target.value)}
          />
          <button className="btn btn-primary mt-2" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="alert alert-danger">
            <p className="error-message">{errorMessage}</p>
          </div>
        )}

        {/* Profile Details */}
        {customerProfile && (
          <div className="profile-details">
            {/* Avatar */}
            <div className="form-group text-center">
              <img
                src={
                  customerProfile.avatarUrl ||
                  'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.1133634801.1736242704&semt=ais_hybrid'
                }
                alt="Avatar"
                className="avatar"
              />
            </div>

            {/* Display Profile Fields Inline */}
            <div className="profile-inline-details">
              <div className="inline-fields">
                <label>Email</label>
                <p>{customerProfile.email}</p>
              </div>
              <div className="inline-fields">
                <label>Username</label>
                <p>{customerProfile.username}</p>
              </div>
            </div>
            <div className="profile-inline-details">
              <div className="inline-fields">
                <label>First Name</label>
                <p>{customerProfile.firstName}</p>
              </div>
              <div className="inline-fields">
                <label>Last Name</label>
                <p>{customerProfile.lastName}</p>
              </div>
            </div>
            <div className="profile-inline-details">
              <div className="inline-fields">
                <label>Mobile Number</label>
                <p>{customerProfile.mobileNumber}</p>
              </div>
              <div className="inline-fields">
                <label>Gender</label>
                <p>{customerProfile.gender || 'Not Specified'}</p>
              </div>
            </div>
            <div className="profile-inline-details">
              <div className="inline-fields">
                <label>Date of Birth</label>
                <p>{customerProfile.dob || 'Not Provided'}</p>
              </div>
              <div className="inline-fields">
                <label>Marital Status</label>
                <p>{customerProfile.maritalStatus || 'Not Specified'}</p>
              </div>
            </div>
            <div className="profile-inline-details">
              <div className="inline-fields">
                <label>Account Number</label>
                <p>{customerProfile.accountNumber}</p>
              </div>
              <div className="inline-fields">
                <label>Balance</label>
                <p>{customerProfile.balance}</p>
              </div>
            </div>
            <div className="profile-inline-details">
              <div className="inline-fields">
                <label>Status</label>
                <p>{customerProfile.status}</p>
              </div>
              <div className="inline-fields">
                <label>Role</label>
                <p>{customerProfile.role}</p>
              </div>
            </div>
            <div className="profile-inline-details">
              <div className="inline-fields">
                <label>Bank Name</label>
                <p>{customerProfile.bankName}</p>
              </div>
              <div className="inline-fields">
                <label>Registration Date</label>
                <p>{customerProfile.registrationDate || 'Not Provided'}</p>
              </div>
            </div>
            <div className="profile-inline-details">
              <div className="inline-fields">
                <label>Account Type</label>
                <p>{customerProfile.accountType || 'Not Specified'}</p>
              </div>
              <div className="inline-fields">
                <label>Branch Code</label>
                <p>{customerProfile.branchCode || 'Not Specified'}</p>
              </div>
            </div>
            <div className="profile-inline-details">
              <div className="inline-fields">
                <label>Branch Name</label>
                <p>{customerProfile.branchName || 'Not Specified'}</p>
              </div>
              <div className="inline-fields">
                <label>Occupation</label>
                <p>{customerProfile.occupation || 'Not Specified'}</p>
              </div>
            </div>
            <div className="profile-inline-details">
              <div className="inline-fields">
                <label>Annual Income</label>
                <p>{customerProfile.annualIncome || 0}</p>
              </div>
              <div className="inline-fields">
                <label>Address Line 1</label>
                <p>{customerProfile.address1 || 'Not Provided'}</p>
              </div>
            </div>
            <div className="profile-inline-details">
              <div className="inline-fields">
                <label>Address Line 2</label>
                <p>{customerProfile.address2 || 'Not Provided'}</p>
              </div>
              <div className="inline-fields">
                <label>City</label>
                <p>{customerProfile.city || 'Not Specified'}</p>
              </div>
            </div>
            <div className="profile-inline-details">
              <div className="inline-fields">
                <label>State</label>
                <p>{customerProfile.state || 'Not Specified'}</p>
              </div>
              <div className="inline-fields">
                <label>Country</label>
                <p>{customerProfile.country || 'Not Specified'}</p>
              </div>
            </div>
            <div className="profile-inline-details">
              <div className="inline-fields">
                <label>Pincode</label>
                <p>{customerProfile.pincode || 'Not Provided'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminCustomerProfile;
