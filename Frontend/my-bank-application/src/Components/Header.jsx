import React, { useEffect } from 'react';
import '../css/Header.css';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const isLoggedIn = !!user;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <header className="header">
      <div className="d-flex align-items-center">
        <img src="images/Mitra.png" alt="Logo" className="logo" />
        <div className="header-text">Mitra</div>
      </div>
      <div className="nav-icons">
        <Link to={isLoggedIn ? "/profile" : "/login"}>
          <i className={isLoggedIn ? "fas fa-user-circle" : "fas fa-sign-in-alt"}></i>
          <span className="tooltip-text">{isLoggedIn ? "Profile" : "Login"}</span>
        </Link>
        {!isLoggedIn && (
          <Link to="/register">
            <i className="fas fa-user-plus"></i>
            <span className="tooltip-text">Register</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
