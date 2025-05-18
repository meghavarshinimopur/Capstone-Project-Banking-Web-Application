import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/Transaction.css';

const TransactionHistory = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.username) {
          const userResponse = await axios.get(`http://localhost:8080/customer/details/${storedUser.username}`);
          setUser(userResponse.data);
  
          const transactionsResponse = await axios.get(`http://localhost:8080/transaction/history/${storedUser.username}`);
          const transactionData = transactionsResponse.data;
  
          if (Array.isArray(transactionData)) {
            setTransactions(transactionData);
            setFilteredTransactions(transactionData);
          } else {
            console.error('Transaction data is not an array:', transactionData);
            setTransactions([]);
            setFilteredTransactions([]);
          }
        } else {
          setResponseMessage('Please log in to view transaction history.');
        }
      } catch (error) {
        setResponseMessage('Error fetching user data. Please try again.');
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);
  

  const applyFilters = () => {
    let filtered = [...transactions];

    if (selectedMonth) {
      const month = parseInt(selectedMonth, 10);
      filtered = filtered.filter((transaction) => {
        const transactionMonth = new Date(transaction.timestamp).getMonth() + 1;
        return transactionMonth === month;
      });
    }

    if (startDate) {
      filtered = filtered.filter((transaction) => new Date(transaction.timestamp) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter((transaction) => new Date(transaction.timestamp) <= new Date(endDate));
    }

    if (minAmount) {
      filtered = filtered.filter((transaction) => transaction.amount >= parseFloat(minAmount));
    }

    if (maxAmount) {
      filtered = filtered.filter((transaction) => transaction.amount <= parseFloat(maxAmount));
    }

    setFilteredTransactions(filtered);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container transaction-container flex-grow-1">
        <h1 className="text-center mb-4">Transaction History</h1>

        {user && (
          <div className="user-info mb-4">
            <h5 className="text-primary">Your Details:</h5>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Account Number:</strong> {user.accountNumber}</p>
            <p><strong>Balance:</strong> ₹{user.balance}</p>
          </div>
        )}

        {/* Filter Section */}
        <div className="filter-form bg-light p-4 rounded shadow-sm">
          <h5 className="text-primary mb-4">Filters:</h5>
          <label htmlFor="month" className="form-label">Filter by Month:</label>
          <select
            id="month"
            className="form-control"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">-- Select Month --</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>

          <label htmlFor="startDate" className="form-label">Start Date:</label>
          <input
            id="startDate"
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label htmlFor="endDate" className="form-label">End Date:</label>
          <input
            id="endDate"
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <label htmlFor="minAmount" className="form-label">Minimum Amount:</label>
          <input
            id="minAmount"
            type="number"
            className="form-control"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />

          <label htmlFor="maxAmount" className="form-label">Maximum Amount:</label>
          <input
            id="maxAmount"
            type="number"
            className="form-control"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />

          <button className="btn btn-primary mt-3" onClick={applyFilters}>
            Apply Filters
          </button>
        </div>

        {/* Transaction List */}
        <div className="transaction-list bg-white p-4 rounded shadow-sm">
          <h5 className="text-center mb-4">Transaction Records</h5>
          {filteredTransactions.length > 0 ? (
            <table className="table table-bordered">
              <thead className="table-header">
                <tr>
                  <th>UTR ID</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.utrId}>
                    <td>{transaction.utrId}</td>
                    <td>{transaction.type}</td>
                    <td
                      className={transaction.status === 'success' ? 'text-success' : 'text-danger'}
                    >
                      {transaction.status}
                    </td>
                    <td>₹{transaction.amount}</td>
                    <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-muted">No transactions found for the selected filters.</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TransactionHistory;
