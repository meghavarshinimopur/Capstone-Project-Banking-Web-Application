import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/Navbar.css'; // Reuse existing Navbar CSS
import Mitra from '../../assets/Mitra.png'; // Replace with admin-specific logo if needed
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const storedAdmin = JSON.parse(localStorage.getItem('admin'));
        if (storedAdmin && storedAdmin.username) {
          const response = await axios.get(`http://localhost:8080/admin/details/${storedAdmin.username}`);
          if (response.data) {
            setAdmin(response.data);
          }
        } else {
          navigate('/admin/login'); // Redirect to admin login if no admin data
        }
      } catch (error) {
        console.error('Error fetching admin details:', error);
        navigate('/admin/login');
      }
    };

    fetchAdmin();

    // Enable Bootstrap tooltips
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
      await axios.post('http://localhost:8080/admin/logout');
      setAdmin(null); // Clear admin state
      localStorage.removeItem('admin'); // Clear local storage
      navigate('/admin/login'); // Redirect to admin login
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleLogoutConfirmation = () => {
    setShowLogoutModal(true);
  };

  const handleCloseLogoutModal = () => {
    setShowLogoutModal(false);
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">
        {/* Admin Panel Logo */}
        <a className="navbar-brand d-flex align-items-center" href="/admindash">
          <img src={Mitra} alt="Admin Logo" className="logo" />
          <span className="fw-bold">Mitra Bank</span>
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
            <li className="nav-item"><a className="nav-link" href="/admin/history">View History</a></li>
            <li className="nav-item"><a className="nav-link" href="/admin/beni">See Beneficiaries</a></li>
            <li className="nav-item"><a className="nav-link" href="/admin/customers">View Customer Profiles</a></li>
          </ul>

          {/* Right Side Icons */}
          <div className="nav-icons ms-auto d-flex">
            {admin ? (
              <div className="profile-container">
                <a href="/admin/login" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Login">
                  <i className="bi bi-door-open"></i>
                </a>
                <a href="/admin/register" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Register">
                  <i className="bi bi-file-earmark-person"></i>
                </a>
                <a
                  href="#"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title={`${admin.username}`}
                  onClick={togglePopup}
                >
                  <i className="bi bi-person-fill-gear profile-icon"></i>
                </a>
                {showPopup && (
                  <div className="profile-popup">
                    <span className="initials">
                      {admin.username.charAt(0).toUpperCase()}
                    </span>
                    <span className="fullname">{admin.username}</span>
                    <div className="profile-buttons">
                      <button
                        className="btn btn-profile"
                        onClick={() => navigate('/admin/customers')}
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
                <a href="/admin/login" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Login">
                  <i className="bi bi-door-open"></i>
                </a>
                <a href="/admin/register" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Register">
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

export default AdminNavbar;
