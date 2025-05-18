import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar'; // Admin-specific Navbar
import Footer from '../../Components/Footer'; // Footer component
import axios from 'axios';
import '../css/AdminDashboard.css'; // Add custom styles for dashboard and tables

const AdminTransaction = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomer, setFilteredCustomer] = useState(null);
  const [searchAccountNumber, setSearchAccountNumber] = useState('');
  const [selectedCustomerTransactions, setSelectedCustomerTransactions] = useState([]);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const adminUsername = JSON.parse(localStorage.getItem('admin')).username; // Admin validation
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

  const handleSearch = async () => {
    try {
      const adminUsername = JSON.parse(localStorage.getItem('admin')).username;
      const response = await axios.get(
        `http://localhost:8080/admin/customers/search?accountNumber=${searchAccountNumber}`,
        { headers: { 'Admin-Username': adminUsername } }
      );
      setFilteredCustomer(response.data);
    } catch (error) {
      console.error('Error searching customer:', error);
      setFilteredCustomer(null);
    }
  };

  const handleViewTransactions = async (username) => {
    try {
      const adminUsername = JSON.parse(localStorage.getItem('admin')).username;
      const response = await axios.get(
        `http://localhost:8080/admin/customers/${username}/transactions`,
        { headers: { 'Admin-Username': adminUsername } }
      );
      setSelectedCustomerTransactions(response.data);
      setShowTransactionModal(true);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const closeTransactionModal = () => {
    setShowTransactionModal(false);
    setSelectedCustomerTransactions([]);
  };

  return (
    <div>
      <AdminNavbar />
      <div className="dashboard-container">
        <h1 className="text-center mb-4">Admin: View Transactions</h1>
        <div className="search-bar mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Account Number"
            value={searchAccountNumber}
            onChange={(e) => setSearchAccountNumber(e.target.value)}
          />
          <button className="btn btn-primary mt-2" onClick={handleSearch}>
            Search
          </button>
        </div>

        {filteredCustomer ? (
          <div className="filtered-result mb-4">
            <h3>Filtered Customer</h3>
            <p><strong>Name:</strong> {filteredCustomer.firstName} {filteredCustomer.lastName}</p>
            <p><strong>Email:</strong> {filteredCustomer.email}</p>
            <p><strong>Mobile:</strong> {filteredCustomer.mobileNumber}</p>
            <p><strong>Account Number:</strong> {filteredCustomer.accountNumber}</p>
            <button
              className="btn btn-info"
              onClick={() => handleViewTransactions(filteredCustomer.username)}
            >
              View Transactions
            </button>
          </div>
        ) : (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Account Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.username}</td>
                  <td>{customer.email}</td>
                  <td>{customer.mobileNumber}</td>
                  <td>{customer.accountNumber}</td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={() => handleViewTransactions(customer.username)}
                    >
                      View Transactions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Transaction Modal */}
        {showTransactionModal && (
          <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog1" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Transaction History</h5>
                  <button type="button" className="close" onClick={closeTransactionModal}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {selectedCustomerTransactions.length > 0 ? (
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sender Account</th>
                          <th>Receiver Account</th>
                          <th>Amount</th>
                          <th>Type</th>
                          <th>Timestamp</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCustomerTransactions.map((transaction, index) => (
                          <tr key={index}>
                            <td>{transaction.senderAccountNumber}</td>
                            <td>{transaction.receiverAccountNumber}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.type}</td>
                            <td>{transaction.timestamp}</td>
                            <td>{transaction.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No transactions found.</p>
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

export default AdminTransaction;
