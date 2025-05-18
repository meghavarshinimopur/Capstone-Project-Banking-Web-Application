import React, { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavbar"; // Admin-specific Navbar
import Footer from "../../Components/Footer"; // Footer component
import axios from "axios";
import '../../css/SuccessModel.css';
import successImage from '../../assets/success.png'; // Ensure the success image exists


const AdminCardApprovalPage = () => {
  const [pendingCards, setPendingCards] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State for confirmation modal
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
  const [countdown, setCountdown] = useState(3); // Countdown for success modal
  const [selectedCardId, setSelectedCardId] = useState(null); // Store selected card ID for approval

  // Fetch pending card applications on component mount
  useEffect(() => {
    const fetchPendingCards = async () => {
      try {
        const adminUsername = JSON.parse(localStorage.getItem("admin")).username; // Retrieve admin username
        setIsLoading(true);
        const response = await axios.get("http://localhost:8080/api/cards/pending", {
          headers: { "Admin-Username": adminUsername },
        });
        setPendingCards(response.data);
        setResponseMessage("");
      } catch (error) {
        setResponseMessage("Error fetching pending card applications.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingCards();
  }, []);

  // Show confirmation modal before approving a card
  const handleApproveClick = (cardId) => {
    setSelectedCardId(cardId); // Set the selected card ID
    setShowConfirmModal(true); // Show confirmation modal
  };

  // Approve the selected card
  const confirmApproveCard = async () => {
    try {
      const adminUsername = JSON.parse(localStorage.getItem("admin")).username; // Retrieve admin username
      setIsLoading(true);
      await axios.put(`http://localhost:8080/admin/approve/card/${selectedCardId}`, null, {
        headers: { "Admin-Username": adminUsername },
      });
      setPendingCards(pendingCards.filter((card) => card.id !== selectedCardId)); // Remove approved card from state
      setResponseMessage("Card approved successfully!");
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
      setResponseMessage("Error approving card. Please try again.");
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
        <h1 className="text-center my-4">Admin: Approve Card Applications</h1>

        {/* Pending Cards Table */}
        <div className="fd-table bg-light p-4 rounded shadow-sm">
          <h5 className="text-center mb-4">Pending Card Applications</h5>
          {pendingCards.length === 0 ? (
            <p className="text-center text-muted">No pending card applications found.</p>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Card Type</th>
                  <th>Name on Card</th>
                  <th>Card Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingCards.map((card) => (
                  <tr key={card.id}>
                    <td>{card.cardType}</td>
                    <td>{card.nameOnCard}</td>
                    <td>{card.cardNumber || "Generated After Approval"}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleApproveClick(card.id)}
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
                <h5 className="modal-title">Confirm Card Approval</h5>
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
                <p>Are you sure you want to approve this card application?</p>
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
                  onClick={confirmApproveCard}
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
                <p>Card application approved successfully!</p>
                <p>Redirecting in {countdown} seconds...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCardApprovalPage;
