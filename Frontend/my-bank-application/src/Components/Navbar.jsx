import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Navbar.css'; // Import external CSS
import Mitra from '../assets/Mitra.png';
import { useNavigate } from 'react-router-dom'; // Updated import

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout confirmation modal

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.username) {
          const response = await axios.get(`http://localhost:8080/customer/details/${storedUser.username}`);
          if (response.data) {
            setUser(response.data); // Set the user data
          }
        } else {
          navigate('/login'); // Redirect to login if no user is found
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        navigate('/login'); // Navigate to login if an error occurs
      }
    };

    fetchUser();

    // Enable Bootstrap Tooltips
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, [navigate]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/customer/logout');
      setUser(null); // Clear user state
      localStorage.removeItem('user'); // Remove user data from local storage
      navigate('/login'); // Redirect to login page using navigate
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleLogoutConfirmation = () => {
    setShowLogoutModal(true); // Show logout confirmation modal
  };

  const handleCloseLogoutModal = () => {
    setShowLogoutModal(false); // Close logout confirmation modal
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">
        {/* Logo & Name */}
        <a className="navbar-brand d-flex align-items-center" href="/dashboard">
          <img src={Mitra} alt="Mitra Logo" className="logo" />
          <span className="fw-bold">Mitra</span>
        </a>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-3">
            <li className="nav-item"><a className="nav-link" href="/history">View Transactions</a></li>
            <li className="nav-item"><a className="nav-link" href="/beneficiary">Add Beneficiaries</a></li>
            <li className="nav-item"><a className="nav-link" href="/beneficiary-transaction">Transfer Money</a></li>
            <li className="nav-item"><a className="nav-link" href="/viewprofile">View & Edit Profile</a></li>
          </ul>

          {/* Right Side Icons */}
          <div className="nav-icons ms-auto d-flex">
            {user ? (
              <div className="profile-container">
                <a href="/login" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Login">
                  <i className="bi bi-door-open"></i>
                </a>
                <a href="/register" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Register">
                  <i className="bi bi-file-earmark-person"></i>
                </a>
                <a
                  href="#"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title={`${user.firstName} ${user.lastName}`}
                  onClick={togglePopup}
                >
                  <i className="bi bi-person-fill-gear profile-icon"></i>
                </a>
                {showPopup && (
                  <div className="profile-popup">
                    <span className="initials">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </span>
                    <span className="fullname">
                      {user.firstName} {user.lastName}
                    </span>
                    <div className="profile-buttons">
                      <button
                        className="btn btn-profile"
                        onClick={() => navigate('/viewprofile')}
                      >
                        Profile
                      </button>
                      <button className="btn btn-logout" onClick={handleLogoutConfirmation}>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a href="/login" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Login">
                  <i className="bi bi-door-open"></i>
                </a>
                <a href="/register" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Register">
                  <i className="bi bi-file-earmark-person"></i>
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Logout</h5>
                <button type="button" className="close" onClick={handleCloseLogoutModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to logout?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseLogoutModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
