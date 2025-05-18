import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../css/UpdatePassword.css";
import successImage from "../assets/success.png"; // Ensure you have this image in your assets folder

const UpdatePassword = () => {
  const [passwordDetails, setPasswordDetails] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // Success state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [countdown, setCountdown] = useState(3); // Countdown for success modal

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordDetails({
      ...passwordDetails,
      [name]: value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const validatePasswords = () => {
    if (passwordDetails.newPassword !== passwordDetails.confirmPassword) {
      setError("New password and confirmation password do not match.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validatePasswords()) {
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.username) {
        await axios.post(
          `http://localhost:8080/profile/updatePassword/${storedUser.username}`,
          {
            currentPassword: passwordDetails.currentPassword,
            newPassword: passwordDetails.newPassword,
          }
        );

        setSuccess(true); // Trigger success modal
        setPasswordDetails({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Start countdown
        const timer = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        // Redirect after countdown
        setTimeout(() => {
          clearInterval(timer);
          setSuccess(false);
        }, 3000);
      } else {
        setError("User is not logged in.");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      setError(
        err.response?.data || "An error occurred while updating the password."
      );
    } finally {
      setShowConfirmModal(false); // Close modal after submission
    }
  };

  const handleOpenModal = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  return (
    <div>
      <Navbar />
      <div className="update-password-container">
        <div className="password-card">
          <h2 className="password-title">Update Password</h2>
          <form onSubmit={handleOpenModal}>
            <div className="form-group">
              <label>Current Password</label>
              <div className="input-group">
                <input
                  type={showPasswords.currentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordDetails.currentPassword}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    togglePasswordVisibility("currentPassword")
                  }
                >
                  {showPasswords.currentPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>New Password</label>
              <div className="input-group">
                <input
                  type={showPasswords.newPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordDetails.newPassword}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => togglePasswordVisibility("newPassword")}
                >
                  {showPasswords.newPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="input-group">
                <input
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordDetails.confirmPassword}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                >
                  {showPasswords.confirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && <p className="text-danger">{error}</p>}

            <div className="password-actions text-center mt-4">
              <button type="submit" className="btn btn-primary">
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Password Update</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseModal}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to update your password?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {success && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Password Updated Successfully!</h5>
              </div>
              <div className="modal-body text-center">
                <img
                  src={successImage}
                  alt="Success"
                  style={{ width: "100px" }}
                />
                <p className="mt-3">
                  Your password has been updated successfully! Redirecting in{" "}
                  {countdown} seconds...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatePassword;
