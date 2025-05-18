import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar'; // Admin Navbar
import Footer from '../../Components/Footer'; // Footer component
import axios from 'axios';
import '../css/AdminDashboard.css'; // Reuse styles

const AdminBeneficiary = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState([]);
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
  const [showBeneficiaryModal, setShowBeneficiaryModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const adminUsername = JSON.parse(localStorage.getItem('admin')).username;
        const response = await axios.get('http://localhost:8080/admin/customers/all', {
          headers: { 'Admin-Username': adminUsername },
        });
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleViewBeneficiaries = async (username, fullName) => {
    try {
      const adminUsername = JSON.parse(localStorage.getItem('admin')).username;
      const response = await axios.get(
        `http://localhost:8080/admin/customers/${username}/beneficiaries`,
        { headers: { 'Admin-Username': adminUsername } }
      );

      if (response.status === 200 && Array.isArray(response.data)) {
        setSelectedBeneficiaries(response.data);
        setErrorMessage(''); // Clear any previous error messages
      } else if (response.status === 200 && typeof response.data === 'string') {
        setSelectedBeneficiaries([]); // Clear beneficiary list
        setErrorMessage(response.data); // Set error message from the server
      }
      setSelectedCustomerName(fullName);
      setShowBeneficiaryModal(true); // Show the modal
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
      setSelectedBeneficiaries([]); // Clear beneficiary list
      setErrorMessage('An error occurred while fetching beneficiaries.');
      setShowBeneficiaryModal(true); // Show the modal with error
    }
  };

  const closeBeneficiaryModal = () => {
    setShowBeneficiaryModal(false);
    setSelectedBeneficiaries([]);
    setErrorMessage(''); // Reset error message on close
  };

  return (
    <div>
      <AdminNavbar />
      <div className="dashboard-container">
        <h1 className="text-center mb-4">Admin: View Beneficiaries</h1>

        {/* Customer Table */}
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Account Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.firstName} {customer.lastName}</td>
                <td>{customer.email}</td>
                <td>{customer.accountNumber}</td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={() => handleViewBeneficiaries(customer.username, `${customer.firstName} ${customer.lastName}`)}
                  >
                    View Beneficiaries
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Beneficiary Modal */}
        {showBeneficiaryModal && (
          <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog1" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedCustomerName}'s Beneficiaries</h5>
                  <button type="button" className="close" onClick={closeBeneficiaryModal}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {selectedBeneficiaries.length > 0 ? (
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Beneficiary Name</th>
                          <th>Account Number</th>
                          <th>Bank Name</th>
                          <th>Max Transfer Limit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBeneficiaries.map((beneficiary, index) => (
                          <tr key={index}>
                            <td>{beneficiary.name}</td>
                            <td>{beneficiary.accountNumber}</td>
                            <td>{beneficiary.bankName}</td>
                            <td>{beneficiary.maxTransferLimit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-danger text-center">{errorMessage}</p>
                  )}
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

export default AdminBeneficiary;
