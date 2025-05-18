import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar"; // Admin-specific Navbar
import Footer from "../../Components/Footer"; // Reuse existing Footer component
import axios from "axios";
import "../css/AdminDashboard.css"; // Reuse existing Dashboard styles

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const storedAdmin = JSON.parse(localStorage.getItem("admin"));
        if (storedAdmin && storedAdmin.username) {
          const response = await axios.get(
            `http://localhost:8080/admin/details/${storedAdmin.username}`
          );
          if (response.data) {
            setAdmin(response.data); // Set the admin details
          }
        } else {
          window.location.href = "/admin/login"; // Redirect to admin login if no admin data is stored
        }
      } catch (error) {
        console.error("Error fetching admin details:", error);
        window.location.href = "/admin/login"; // Ensure admin login redirect on error
      }
    };

    fetchAdminDetails();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="dashboard">
        <div className="dashboard-main">
          {admin ? (
            <div className="admin-profile">
              <img
                className="admin-avatar"
                src="https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?ga=GA1.1.1133634801.1736242704&semt=ais_country_boost&w=740" // Placeholder avatar
                alt="Admin Avatar"
              />
              <h1 className="admin-welcome">Welcome, {admin.username}!</h1>
              <div className="admin-details">
                <div className="detail-item">
                  <strong>Username:</strong> {admin.username}
                </div>
                <div className="detail-item">
                  <strong>Email:</strong> {admin.email}
                </div>
                <div className="detail-item">
                  <strong>Role:</strong> {admin.role}
                </div>
              </div>
              <div className="dashboard-cards">
                {/* Action Cards */}
                <div
                  className="card action-card"
                  onClick={() => (window.location.href = "/adminagree")}
                >
                  <i className="fas fa-seedling fa-3x"></i>
                  <h5>Approve Agriculture Loans</h5>
                </div>
                <div
                  className="card action-card"
                  onClick={() => (window.location.href = "/adminhome")}
                >
                  <i className="fas fa-home fa-3x"></i>
                  <h5>Approve Home Loans</h5>
                </div>
                <div
                  className="card action-card"
                  onClick={() => (window.location.href = "/adminfd")}
                >
                  <i className="fas fa-piggy-bank fa-3x"></i>
                  <h5>Approve Fixed Deposits</h5>
                </div>
                <div
                  className="card action-card"
                  onClick={() => (window.location.href = "/admincard")}
                >
                  <i className="fas fa-credit-card fa-3x"></i>
                  <h5>Approve Cards</h5>
                </div>
              </div>
            </div>
          ) : (
            <p>Loading admin details...</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
