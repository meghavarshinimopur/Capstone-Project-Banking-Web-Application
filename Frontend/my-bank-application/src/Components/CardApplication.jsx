import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../css/FixedDeposit.css";
import successImage from "../assets/success.png";

const CardManagementPage = () => {
  const [cards, setCards] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [formData, setFormData] = useState({
    cardType: "",
    nameOnCard: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [modalAction, setModalAction] = useState("");
  const [selectedCardId, setSelectedCardId] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.username) {
          const customerResponse = await axios.get(
            `http://localhost:8080/customer/details/${storedUser.username}`
          );
          setCustomer(customerResponse.data);

          const cardsResponse = await axios.get(
            `http://localhost:8080/api/cards/view/${storedUser.username}`
          );
          setCards(cardsResponse.data);
        } else {
          setResponseMessage("Please log in to view or manage cards.");
        }
      } catch (error) {
        setResponseMessage("Error fetching customer or card details.");
      }
    };
    fetchDetails();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const applyForCard = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
    setModalAction("apply");
  };

const confirmAction = async () => {
  try {
    setIsLoading(true);
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (modalAction === "apply") {
      const response = await axios.post(
        `http://localhost:8080/api/cards/apply/${storedUser.username}`,
        formData
      );
      setCards([...cards, response.data]);
      setResponseMessage("Card applied successfully!");
      setFormData({ cardType: "", nameOnCard: "" });
    } else if (modalAction === "cancel") {
      await axios.delete(`http://localhost:8080/api/cards/cancel/${selectedCardId}`);
      setCards(cards.filter((card) => card.id !== selectedCardId));
      setResponseMessage("Card application cancelled.");
    }

    setCountdown(3);
    setShowSuccessModal(true);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setShowSuccessModal(false);
          setShowConfirmModal(false);
        }
        return prev - 1;
      });
    }, 1000);
  } catch (error) {
    setResponseMessage(
      error.response?.data || "Error processing the action."
    );

    // 👇 Immediately hide the confirm modal if there's an error
    setShowConfirmModal(false);
  } finally {
    setIsLoading(false);
  }
};
  const handleAction = (action, cardId) => {
    setSelectedCardId(cardId);
    setModalAction(action);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container card-management-container flex-grow-1">
        <h1 className="text-center mb-4">Manage Cards</h1>

        {customer && (
          <div className="customer-info bg-light p-3 rounded shadow-sm mb-4">
            <h5>Your Account Details:</h5>
            <p><strong>Username:</strong> {customer.username}</p>
            <p><strong>Account Number:</strong> {customer.accountNumber}</p>
          </div>
        )}

        {/* Card Application Form */}
        <form onSubmit={applyForCard} className="card-application-form bg-white p-4 rounded shadow-sm mb-4">
          <h5>Apply for a Banking Card</h5>
          <div className="form-group mb-3">
            <label htmlFor="cardType">Card Type:</label>
            <select
              id="cardType"
              className="form-control"
              value={formData.cardType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Card Type</option>
              <option value="Teenager">Teenager Banking Card</option>
              <option value="Senior Citizen">Senior Citizen Banking Card</option>
            </select>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="nameOnCard">Name on Card:</label>
            <input
              type="text"
              id="nameOnCard"
              className="form-control"
              value={formData.nameOnCard}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100" disabled={isLoading}>
            {isLoading ? "Processing..." : "Apply for Card"}
          </button>
        </form>

        {/* Card Table */}
        <div className="cards-table bg-light p-4 rounded shadow-sm">
          <h5>Your Cards</h5>
          {cards.length === 0 ? (
            <p className="text-center">No cards found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Card Number</th>
                  <th>Name on Card</th>
                  <th>Card Type</th>
                  <th>Status</th>
                  <th>Approval Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card) => (
                  <tr key={card.id}>
                    <td>{card.cardNumber || "—"}</td>
                    <td>{card.nameOnCard}</td>
                    <td>{card.cardType}</td>
                    <td>{card.status}</td>
                    <td>{card.approvalDate ? new Date(card.approvalDate).toLocaleDateString() : "Pending"}</td>
                    <td>
                      {/* Show Cancel button only if status is pending */}
                      {card.status.toLowerCase() === "pending" && (
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleAction("cancel", card.id)}
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                      )}

                      {/* Show View Card button only if status is approved */}
                      {card.status.toLowerCase() === "approved" && (
                        <a href="/card1" className="btn btn-info btn-sm">
                          View Card
                        </a>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {responseMessage && (
          <div
            className={`alert mt-3 text-center ${responseMessage.includes("success") ? "alert-success" : "alert-danger"}`}
          >
            {responseMessage}
          </div>
        )}
      </div>
      <Footer />

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Action</h5>
                <button type="button" className="close" onClick={closeConfirmModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  {modalAction === "apply"
                    ? "Are you sure you want to apply for this card?"
                    : "Are you sure you want to cancel this card application?"}
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeConfirmModal}>Cancel</button>
                <button className="btn btn-primary" onClick={confirmAction}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content text-center">
              <div className="modal-header">
                <h5 className="modal-title">Action Completed</h5>
              </div>
              <div className="modal-body">
                <img src={successImage} alt="Success" style={{ width: "100px" }} />
                <p>Your action was successful! Closing in {countdown} seconds...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardManagementPage;
