import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/Beneficiary.css'; // Link to your CSS file
import successImage from '../assets/success.png'; // Reuse the success image if necessary

const ManageBeneficiary = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [transferLimit, setTransferLimit] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null); // Store selected beneficiary for modal actions
  const [responseMessage, setResponseMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // To display the confirmation modal
  const [modalAction, setModalAction] = useState(''); // Stores whether it's 'update' or 'delete'

  const navigate = useNavigate();

  // Fetch user and beneficiaries on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.username) {
          const userResponse = await axios.get(`http://localhost:8080/customer/details/${storedUser.username}`);
          setUser(userResponse.data); // Set user details

          const beneficiaryResponse = await axios.get(`http://localhost:8080/beneficiary/${storedUser.username}/all`);
          setBeneficiaries(beneficiaryResponse.data); // Set list of beneficiaries
        } else {
          setResponseMessage('Please log in to manage beneficiaries.');
        }
      } catch (error) {
        setResponseMessage('Error fetching beneficiaries or user details. Please log in again.');
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const handleUpdateClick = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setModalAction('update');
    setShowModal(true);
  };

  const handleDeleteClick = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setModalAction('delete');
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    setShowModal(false); // Close modal
    setIsLoading(true); // Show loading

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (modalAction === 'update') {
        // Update transfer limit
        await axios.put(
          `http://localhost:8080/beneficiary/update/${selectedBeneficiary.id}/${storedUser.username}`,
          { maxTransferLimit: transferLimit }
        );
        setResponseMessage('Transfer limit updated successfully!');
        setTransferLimit(''); // Clear transfer limit input
      } else if (modalAction === 'delete') {
        // Delete beneficiary
        await axios.delete(
          `http://localhost:8080/beneficiary/delete/${selectedBeneficiary.id}/${storedUser.username}`
        );
        setBeneficiaries(beneficiaries.filter((b) => b.id !== selectedBeneficiary.id)); // Update UI after deletion
        setResponseMessage('Beneficiary deleted successfully!');
      }
    } catch (error) {
      setResponseMessage(
        modalAction === 'update' ? 'Error updating transfer limit.' : 'Error deleting beneficiary.'
      );
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container beneficiary-container flex-grow-1">
        <h1 className="text-center mb-4">Manage Beneficiaries</h1>

        {/* Navigation Buttons */}
        <div className="navigation-buttons d-flex justify-content-between mb-4">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Back
          </button>
          <button className="btn btn-primary" disabled>
            View Beneficiaries
          </button>
        </div>

        {/* Logged-in User Details */}
        {user && (
          <div className="user-info bg-light p-3 rounded shadow-sm mb-4">
            <h5 className="text-primary">Your Details:</h5>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Account Number:</strong> {user.accountNumber}</p>
          </div>
        )}

        {/* Beneficiaries List */}
        <div className="list-section">
          {beneficiaries.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Account Number</th>
                  <th>Bank Name</th>
                  <th>Transfer Limit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {beneficiaries.map((beneficiary) => (
                  <tr key={beneficiary.id}>
                    <td>{beneficiary.name}</td>
                    <td>{beneficiary.accountNumber}</td>
                    <td>{beneficiary.bankName}</td>
                    <td>
                      <input
                        type="number"
                        placeholder="Update Limit"
                        value={transferLimit}
                        onChange={(e) => setTransferLimit(e.target.value)}
                        className="form-control"
                      />
                    </td>
                    <td>
                      <div className="button-container">
                        <button
                          className="btn-edit"
                          onClick={() => handleUpdateClick(beneficiary)}
                          disabled={isLoading}
                        >
                          Update
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteClick(beneficiary)}
                          disabled={isLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-message">No beneficiaries found.</p>
          )}
        </div>

        {/* Response Message */}
        {responseMessage && (
          <div className={`alert mt-3 text-center ${responseMessage.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
            {responseMessage}
          </div>
        )}

        {/* Confirmation Modal */}
        {showModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {modalAction === 'update' ? 'Confirm Update' : 'Confirm Delete'}
                  </h5>
                </div>
                <div className="modal-body text-center">
                  <img src={successImage} alt="Action Confirmation" style={{ width: '100px' }} />
                  <p className="mt-3">
                    {modalAction === 'update'
                      ? 'Are you sure you want to update this beneficiary?'
                      : 'Are you sure you want to delete this beneficiary?'}
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={`btn ${modalAction === 'update' ? 'btn-primary' : 'btn-danger'}`}
                    onClick={handleConfirmAction}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ManageBeneficiary;
