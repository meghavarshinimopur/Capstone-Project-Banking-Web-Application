import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar"; // Admin-specific Navbar
import Footer from "../../Components/Footer"; // Reuse Footer component
import '../../css/SuccessModel.css';
import successImage from '../../assets/success.png'; // Ensure the success image exists


const AdminFDApprovalPage = () => {
  const [pendingFDs, setPendingFDs] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State for confirmation modal
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
  const [countdown, setCountdown] = useState(3); // Countdown for success modal
  const [selectedFDId, setSelectedFDId] = useState(null); // Store selected FD ID for approval

  // Fetch pending fixed deposits when the page loads
  useEffect(() => {
    const fetchPendingFDs = async () => {
      try {
        const adminUsername = JSON.parse(localStorage.getItem("admin")).username; // Retrieve admin username
        setIsLoading(true);
        const response = await axios.get("http://localhost:8080/fixedDeposit/pending", {
          headers: { "Admin-Username": adminUsername },
        });
        setPendingFDs(response.data);
        setResponseMessage("");
      } catch (error) {
        setResponseMessage("Error fetching pending fixed deposit applications.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingFDs();
  }, []);

  // Show confirmation modal before approving a fixed deposit
  const handleApproveClick = (fdId) => {
    setSelectedFDId(fdId); // Set the selected FD ID
    setShowConfirmModal(true); // Show confirmation modal
  };

  // Approve the selected fixed deposit
  const confirmApproveFD = async () => {
    try {
      const adminUsername = JSON.parse(localStorage.getItem("admin")).username; // Retrieve admin username
      setIsLoading(true);
      await axios.put(`http://localhost:8080/admin/approve/fixedDeposit/${selectedFDId}`, null, {
        headers: { "Admin-Username": adminUsername },
      });
      setPendingFDs(pendingFDs.filter((fd) => fd.id !== selectedFDId)); // Remove approved FD from state
      setResponseMessage("Fixed deposit approved successfully!");
      setShowSuccessModal(true); // Show success modal

      // Countdown for success modal
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      setTimeout(() => {
        clearInterval(timer);
        setShowSuccessModal(false);
      }, 3000);
    } catch (error) {
      setResponseMessage("Error approving fixed deposit. Please try again.");
    } finally {
      setIsLoading(false);
      setShowConfirmModal(false); // Close confirmation modal
    }
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false); // Close confirmation modal
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false); // Close success modal
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar /> {/* Admin-specific Navbar */}
      <div className="container flex-grow-1">
        <h1 className="text-center my-4">Admin: Approve Fixed Deposits</h1>

        {/* Pending Fixed Deposits Table */}
        <div className="fd-table bg-light p-4 rounded shadow-sm">
          <h5>Pending Fixed Deposits</h5>
          {pendingFDs.length === 0 ? (
            <p className="text-center">No pending fixed deposit applications found.</p>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Principal Amount</th>
                  <th>Interest Rate</th>
                  <th>Maturity Amount</th>
                  <th>Tenure (Months)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingFDs.map((fd) => (
                  <tr key={fd.id}>
                    <td>{fd.principalAmount}</td>
                    <td>{fd.interestRate}</td>
                    <td>{fd.maturityAmount}</td>
                    <td>{fd.tenureInMonths}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleApproveClick(fd.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Approving..." : "Approve"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Response Message */}
        {responseMessage && (
          <div
            className={`alert mt-3 text-center ${
              responseMessage.includes("successfully") ? "alert-success" : "alert-danger"
            }`}
          >
            {responseMessage}
          </div>
        )}
      </div>
      <Footer /> {/* Footer component */}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Fixed Deposit Approval</h5>
                <button
                  type="button"
                  className="close"
                  onClick={closeConfirmModal}
                  aria-label="Close"
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to approve this fixed deposit application?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeConfirmModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={confirmApproveFD}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Action Completed Successfully!</h5>
                <button
                  type="button"
                  className="close"
                  onClick={closeSuccessModal}
                  aria-label="Close"
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body text-center">
                <img src={successImage} alt="Success" style={{ width: '100px' }} />
                <p>Fixed deposit application approved successfully!</p>
                <p>Redirecting in {countdown} seconds...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFDApprovalPage;
