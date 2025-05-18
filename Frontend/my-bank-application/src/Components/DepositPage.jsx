import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../css/FixedDeposit.css";
import successImage from "../assets/success.png";

const FixedDepositPage = () => {
  const [fixedDeposits, setFixedDeposits] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [formData, setFormData] = useState({
    principalAmount: "",
    interestRate: "",
    tenureInMonths: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [modalAction, setModalAction] = useState(""); // Tracks action type ('create', 'close', 'delete')
  const [selectedDepositId, setSelectedDepositId] = useState(null); // Tracks the selected deposit ID

  // Fetch user details and fixed deposits
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.username) {
          const customerResponse = await axios.get(
            `http://localhost:8080/customer/details/${storedUser.username}`
          );
          setCustomer(customerResponse.data);

          const depositsResponse = await axios.get(
            `http://localhost:8080/fixedDeposit/view/${storedUser.username}`
          );
          setFixedDeposits(depositsResponse.data);
        } else {
          setResponseMessage("Please log in to manage fixed deposits.");
        }
      } catch (error) {
        setResponseMessage("Error fetching customer or fixed deposit details.");
      }
    };

    fetchDetails();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleCreateFixedDeposit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
    setModalAction("create");
  };

  const confirmAction = async () => {
    try {
      setIsLoading(true);
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (modalAction === "create") {
        if (!formData.principalAmount || !formData.interestRate || !formData.tenureInMonths) {
          setResponseMessage("All fields are required to create a fixed deposit.");
          return;
        }
        const response = await axios.post(
          `http://localhost:8080/fixedDeposit/create/${storedUser.username}`,
          formData
        );
        setFixedDeposits([...fixedDeposits, response.data]);
        setResponseMessage("Fixed Deposit created successfully!");
        setFormData({ principalAmount: "", interestRate: "", tenureInMonths: "" });
      } else if (modalAction === "close") {
        await axios.put(`http://localhost:8080/fixedDeposit/close/${selectedDepositId}`);
        setFixedDeposits(
          fixedDeposits.map((fd) =>
            fd.id === selectedDepositId ? { ...fd, status: "closed" } : fd
          )
        );
        setResponseMessage("Fixed Deposit closed successfully!");
      } else if (modalAction === "delete") {
        await axios.delete(`http://localhost:8080/fixedDeposit/delete/${selectedDepositId}`);
        setFixedDeposits(fixedDeposits.filter((fd) => fd.id !== selectedDepositId));
        setResponseMessage("Closed Fixed Deposit deleted successfully!");
      }

      setShowSuccessModal(true);
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 3000);
      setTimeout(() => {
        clearInterval(timer);
        setShowSuccessModal(false);
        setShowConfirmModal(false);
      }, 3000);
    } catch (error) {
      setResponseMessage("Error processing the action.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (action, depositId) => {
    setSelectedDepositId(depositId);
    setModalAction(action);
    setShowConfirmModal(true);
  };

  const handleCloseModal = () => setShowConfirmModal(false);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container fixed-deposit-container flex-grow-1">
        <h1 className="text-center mb-4">Manage Fixed Deposits</h1>

        {customer && (
          <div className="customer-info bg-light p-3 rounded shadow-sm mb-4">
            <h5>Your Account Details:</h5>
            <p><strong>Username:</strong> {customer.username}</p>
            <p><strong>Account Number:</strong> {customer.accountNumber}</p>
          </div>
        )}

        {/* Fixed Deposit Creation Form */}
        <form onSubmit={handleCreateFixedDeposit} className="fixed-deposit-form bg-white p-4 rounded shadow-sm mb-4">
          <h5>Create New Fixed Deposit</h5>
          <div className="form-group mb-3">
            <label htmlFor="principalAmount">Principal Amount:</label>
            <input
              type="number"
              id="principalAmount"
              className="form-control"
              value={formData.principalAmount}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="interestRate">Interest Rate:</label>
            <input
              type="number"
              id="interestRate"
              className="form-control"
              value={formData.interestRate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="tenureInMonths">Tenure (Months):</label>
            <input
              type="number"
              id="tenureInMonths"
              className="form-control"
              value={formData.tenureInMonths}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100" disabled={isLoading}>
            {isLoading ? "Processing..." : "Create Fixed Deposit"}
          </button>
        </form>

        {/* Fixed Deposit Table */}
        <div className="fixed-deposits-table bg-light p-4 rounded shadow-sm">
          <h5>Your Fixed Deposits</h5>
          {fixedDeposits.length === 0 ? (
            <p className="text-center">No fixed deposits found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Principal (₹)</th>
                  <th>Interest (%)</th>
                  <th>Tenure (Months)</th>
                  <th>Status</th>
                  <th>Maturity Amount (₹)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fixedDeposits.map((fd) => (
                  <tr key={fd.id}>
                    <td>{fd.principalAmount}</td>
                    <td>{fd.interestRate}</td>
                    <td>{fd.tenureInMonths}</td>
                    <td>{fd.status}</td>
                    <td>{fd.maturityAmount}</td>
                    <td>
                      {fd.status === "active" && (
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleAction("close", fd.id)}
                          disabled={isLoading}
                        >
                          Close
                        </button>
                      )}
                      {fd.status === "closed" && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleAction("delete", fd.id)}
                          disabled={isLoading}
                        >
                          Delete
                        </button>
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
            className={`alert mt-3 text-center ${
              responseMessage.includes("successfully") ? "alert-success" : "alert-danger"
            }`}
          >
            {responseMessage}
          </div>
        )}
      </div>
      <Footer />

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Confirm Action</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {modalAction === "create" && (
                  <p>Are you sure you want to create this fixed deposit?</p>
                )}
                {modalAction === "close" && (
                  <p>Are you sure you want to close this fixed deposit?</p>
                )}
                {modalAction === "delete" && (
                  <p>Are you sure you want to delete this closed fixed deposit?</p>
                )}
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
                  onClick={confirmAction}
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
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Action Completed Successfully!</h5>
              </div>
              <div className="modal-body text-center">
                <img
                  src={successImage}
                  alt="Success"
                  style={{ width: "100px" }}
                />
                <p className="mt-3">
                  Your action has been completed successfully! Redirecting in{" "}
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

export default FixedDepositPage;
