import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/Profile.css'; // Ensure relevant CSS styling is added

const DisplayDetails = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem('user')); // Fetch username from local storage

  // Fetch Profile Details
  useEffect(() => {
    if (storedUser?.username) {
      axios
        .get(`http://localhost:8080/profile/${storedUser.username}`)
        .then((response) => {
          setProfile(response.data);
        })
        .catch((err) => {
          setError(err.response?.data || 'Error fetching profile');
        });
    } else {
      setError('User is not logged in');
    }
  }, [storedUser]);

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="profile-container">
          <h2>Error</h2>
          <p className="error-message">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <Navbar />
        <div className="profile-container">
          <p>Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="profile-container1">
        <h2>Customer Profile</h2>

        {/* Avatar */}
        <div className="form-group">
          <img
            src={profile.avatarUrl || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.1133634801.1736242704&semt=ais_hybrid'}
            alt="Avatar"
            className="avatar"
          />
        </div>

        {/* Display Fields */}
        <div className="profile-details">
          <div className="form-group">
            <label>Email</label>
            <p>{profile.email}</p>
          </div>
          <div className="form-group">
            <label>Username</label>
            <p>{profile.username}</p>
          </div>
          <div className="form-group">
            <label>First Name</label>
            <p>{profile.firstName}</p>
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <p>{profile.lastName}</p>
          </div>
          <div className="form-group">
            <label>Mobile Number</label>
            <p>{profile.mobileNumber}</p>
          </div>
          <div className="form-group">
            <label>Gender</label>
            <p>{profile.gender || 'Not Specified'}</p>
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <p>{profile.dob || 'Not Provided'}</p>
          </div>
          <div className="form-group">
            <label>Marital Status</label>
            <p>{profile.maritalStatus || 'Not Specified'}</p>
          </div>
          <div className="form-group">
            <label>Account Number</label>
            <p>{profile.accountNumber}</p>
          </div>
          <div className="form-group">
            <label>Balance</label>
            <p>{profile.balance}</p>
          </div>
          <div className="form-group">
            <label>Status</label>
            <p>{profile.status}</p>
          </div>
          <div className="form-group">
            <label>Role</label>
            <p>{profile.role}</p>
          </div>
          <div className="form-group">
            <label>Bank Name</label>
            <p>{profile.bankName}</p>
          </div>
          <div className="form-group">
            <label>Registration Date</label>
            <p>{profile.registrationDate || 'Not Provided'}</p>
          </div>
          <div className="form-group">
            <label>Account Type</label>
            <p>{profile.accountType || 'Not Specified'}</p>
          </div>
          <div className="form-group">
            <label>Branch Code</label>
            <p>{profile.branchCode || 'Not Specified'}</p>
          </div>
          <div className="form-group">
            <label>Branch Name</label>
            <p>{profile.branchName || 'Not Specified'}</p>
          </div>
          <div className="form-group">
            <label>Occupation</label>
            <p>{profile.occupation || 'Not Specified'}</p>
          </div>
          <div className="form-group">
            <label>Annual Income</label>
            <p>{profile.annualIncome || 0}</p>
          </div>
          <div className="form-group">
            <label>Address Line 1</label>
            <p>{profile.address1 || 'Not Provided'}</p>
          </div>
          <div className="form-group">
            <label>Address Line 2</label>
            <p>{profile.address2 || 'Not Provided'}</p>
          </div>
          <div className="form-group">
            <label>City</label>
            <p>{profile.city || 'Not Specified'}</p>
          </div>
          <div className="form-group">
            <label>State</label>
            <p>{profile.state || 'Not Specified'}</p>
          </div>
          <div className="form-group">
            <label>Country</label>
            <p>{profile.country || 'Not Specified'}</p>
          </div>
          <div className="form-group">
            <label>Pincode</label>
            <p>{profile.pincode || 'Not Provided'}</p>
          </div>
          <div className="button-container">
            <a href='/updateprofile' className="btn update-profile" >
              Update Profile
            </a>
            <a href='/updatepassword' className="btn change-password" >
              Change Password
            </a>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DisplayDetails;