import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from './Chatbot';
import '../css/Dashboard.css'; // Make sure this is imported

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.username) {
          const response = await axios.get(`http://localhost:8080/customer/details/${storedUser.username}`);
          if (response.data) {
            setUser(response.data);
          }
        } else {
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setUser(null);
        window.location.href = '/login';
      }
    };

    fetchUser();
  }, []);

  const toggleShowAccountNumber = () => setShowAccountNumber(!showAccountNumber);
  const toggleShowBalance = () => setShowBalance(!showBalance);

  const formattedBalance = (balance) => {
    if (showBalance) {
      return balance.toFixed(2);
    }
    return '●●●●●●.●●';
  };

  return (
    <>
      <Navbar user={user} />

      <div className="dashboard">
        <div className="dashboard-main">
          {user ? (
            <div className="user-profile">
              <h1 className="user-name">Hello, {user.firstName} {user.lastName}!</h1>
              <div className="user-info">
                <div className="info-item">
                  <span>Account Number:</span>
                  <span>{showAccountNumber ? user.accountNumber : '●●●●●●●●●●●●●●●●'}</span>
                  <button onClick={toggleShowAccountNumber} className="toggle-btn">
                    {showAccountNumber ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="info-item">
                  <span>Balance:</span>
                  <span>{formattedBalance(user.balance)}</span>
                  <button onClick={toggleShowBalance} className="toggle-btn">
                    {showBalance ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* First four cards (3 per row) */}
              <div className="cards-container">
                <Link to="/deposite" className="card text-decoration-none">
                  <i className="fas fa-piggy-bank fa-3x text-success mb-3"></i>
                  <h5 className="card-title">Fixed Deposits</h5>
                  <p className="card-text">Manage your fixed deposits.</p>
                </Link>

                <Link to="/homeloan" className="card text-decoration-none">
                  <i className="fas fa-home fa-3x text-primary mb-3"></i>
                  <h5 className="card-title">Home Loans</h5>
                  <p className="card-text">Track and manage your home loans.</p>
                </Link>

                <Link to="/agreecultureloan" className="card text-decoration-none">
                  <i className="fas fa-seedling fa-3x text-warning mb-3"></i>
                  <h5 className="card-title">Agriculture Loans</h5>
                  <p className="card-text">View agriculture loan applications.</p>
                </Link>

                <Link to="/cards" className="card text-decoration-none">
                  <i className="fas fa-credit-card fa-3x text-info mb-3"></i>
                  <h5 className="card-title">Cards</h5>
                  <p className="card-text">View senior and teenager cards.</p>
                </Link>
              </div>

              {/* Separate row for About and Contact - 50/50 layout */}
              <div className="cards-container half-row">
                <Link to="/about" className="card half-card text-decoration-none">
                  <i className="fas fa-info-circle fa-3x text-secondary mb-3"></i>
                  <h5 className="card-title">About</h5>
                  <p className="card-text">Learn more about our services and mission.</p>
                </Link>

                <Link to="/contact" className="card half-card text-decoration-none">
                  <i className="fas fa-envelope fa-3x text-danger mb-3"></i>
                  <h5 className="card-title">Contact</h5>
                  <p className="card-text">Get in touch with our support team.</p>
                </Link>
              </div>
            </div>
          ) : (
            <p>Loading user details...</p>
          )}
        </div>
      </div>
      <Footer />
      <Chatbot />
    </>
  );
};

export default Dashboard;
