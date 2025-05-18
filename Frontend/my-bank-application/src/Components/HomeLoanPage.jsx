import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../css/FixedDeposit.css";
import successImage from '../assets/success.png';

const HomeLoanPage = () => {
  const [loans, setLoans] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [formData, setFormData] = useState({
    loanAmount: "",
    interestRate: "",
    tenureInMonths: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [modalAction, setModalAction] = useState("");
  const [selectedLoanId, setSelectedLoanId] = useState(null);

  // Fetch customer details and loans
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.username) {
          const customerResponse = await axios.get(
            `http://localhost:8080/customer/details/${storedUser.username}`
          );
          setCustomer(customerResponse.data);

          const loansResponse = await axios.get(
            `http://localhost:8080/homeLoan/view/${storedUser.username}`
          );
          setLoans(loansResponse.data);
        } else {
          setResponseMessage("Please log in to view or manage home loans.");
        }
      } catch (error) {
        setResponseMessage("Error fetching customer or loan details.");
      }
    };
    fetchDetails();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const applyForLoan = (e) => {
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
          `http://localhost:8080/homeLoan/apply/${storedUser.username}`,
          formData
        );
        setLoans([...loans, response.data]);
        setResponseMessage("Home loan applied successfully!");
        setFormData({ loanAmount: "", interestRate: "", tenureInMonths: "" });
      } else if (modalAction === "close") {
        await axios.put(`http://localhost:8080/homeLoan/close/${selectedLoanId}`);
        setLoans(
          loans.map((loan) =>
            loan.id === selectedLoanId ? { ...loan, status: "closed" } : loan
          )
        );
        setResponseMessage("Home loan closed successfully!");
      } else if (modalAction === "delete") {
        await axios.delete(`http://localhost:8080/homeLoan/delete/${selectedLoanId}`);
        setLoans(loans.filter((loan) => loan.id !== selectedLoanId));
        setResponseMessage("Closed home loan deleted successfully!");
      }

      setShowSuccessModal(true);
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
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

  const handleAction = (action, loanId) => {
    setSelectedLoanId(loanId);
    setModalAction(action);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container fixed-deposit-container flex-grow-1">
        <h1 className="text-center mb-4">Manage Home Loans</h1>

        {/* User Details */}
        {customer && (
          <div className="customer-info bg-light p-3 rounded shadow-sm mb-4">
            <h5>Your Account Details:</h5>
            <p><strong>Username:</strong> {customer.username}</p>
            <p><strong>Account Number:</strong> {customer.accountNumber}</p>
          </div>
        )}

        {/* Apply for Home Loan Form */}
        <form
          onSubmit={applyForLoan}
          className="home-loan-form bg-white p-4 rounded shadow-sm mb-4"
        >
          <h5>Apply for a Home Loan</h5>
          <div className="form-group mb-3">
            <label htmlFor="loanAmount">Loan Amount (₹):</label>
            <input
              type="number"
              id="loanAmount"
              className="form-control"
              value={formData.loanAmount}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="interestRate">Interest Rate (%):</label>
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
          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Apply for Loan"}
          </button>
        </form>

        {/* Home Loans Table */}
        <div className="home-loans-table bg-light p-4 rounded shadow-sm">
          <h5>Your Home Loans</h5>
          {loans.length === 0 ? (
            <p className="text-center">No home loans found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Loan Amount (₹)</th>
                  <th>Interest (%)</th>
                  <th>Tenure (Months)</th>
                  <th>EMI (₹)</th>
                  <th>Status</th>
                  <th>Approval Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id}>
                    <td>{loan.loanAmount}</td>
                    <td>{loan.interestRate}</td>
                    <td>{loan.tenureInMonths}</td>
                    <td>{loan.emiAmount ? loan.emiAmount.toFixed(2) : "Pending"}</td>
                    <td>{loan.status}</td>
                    <td>
                      {loan.approvalDate
                        ? new Date(loan.approvalDate).toLocaleDateString()
                        : "Pending"}
                    </td>
                    <td>
                      {loan.status === "pending" && (
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleAction("close", loan.id)}
                          disabled={isLoading}
                        >
                          Close
                        </button>
                      )}
                      {loan.status === "closed" && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleAction("delete", loan.id)}
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
              responseMessage.includes("successfully")
                ? "alert-success"
                : "alert-danger"
            }`}
          >
            {responseMessage}
          </div>
        )}
      </div>
      <Footer />

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Action</h5>
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
                {modalAction === "apply" && (
                  <p>Are you sure you want to apply for this home loan?</p>
                )}
                {modalAction === "close" && (
                  <p>Are you sure you want to close this home loan?</p>
                )}
                {modalAction === "delete" && (
                  <p>Are you sure you want to delete this closed home loan?</p>
                )}
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
                
                <p>Your action has been completed successfully!</p>
                <p>Redirecting in {countdown} seconds...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeLoanPage;
