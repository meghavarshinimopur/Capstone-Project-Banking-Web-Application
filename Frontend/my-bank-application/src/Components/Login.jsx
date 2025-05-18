import React, { useState } from 'react';
import ForgotPassword from './ForgotPassword';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../css/SuccessModel.css'
import successImage from '../assets/success.png'; // Make sure to have a success image in your assets folder

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    const usernamePattern = /^[a-zA-Z0-9]{3,}$/; // At least 3 characters, alphanumeric
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // At least 8 characters, one uppercase letter, one number

    if (!usernamePattern.test(formData.username)) {
      newErrors.username = 'Username must be at least 3 characters and alphanumeric';
    }
    if (!passwordPattern.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters, include an uppercase letter and a number';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      try {
        await axios.post('http://localhost:8080/customer/login', formData);
        localStorage.setItem('user', JSON.stringify(formData));
        setShowModal(true);
        const timer = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);
        setTimeout(() => {
          clearInterval(timer);
          window.location.href = '/dashboard';
        }, 3000);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setErrors({ login: 'Invalid username or password' });
        } else {
          alert('Login failed!');
        }
      }
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: 'white' }}>
      <div className="row w-100 g-0 shadow-lg rounded overflow-hidden" style={{ maxWidth: '900px' }}>
        <div className="col-md-6 bg-primary text-white d-flex flex-column justify-content-center align-items-center p-5">
          <div className="content-left text-center">
            <h1>Welcome Back!</h1>
            <p className="lead">Access your account and explore amazing features.</p>
            <h5>Enjoy!</h5>
            <p><strong style={{ fontSize: '50px', fontWeight: 600 }}>₹2500</strong></p>
          </div>
        </div>
        <div className="col-md-6 bg-primary d-flex flex-column justify-content-center align-items-center p-4">
          <form className="p-5 rounded bg-light shadow" style={{ width: '100%', maxWidth: '450px' }} onSubmit={handleSubmit}>
            <h3 className="text-left mb-4">Welcome!</h3>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username<span className="sp-red"> *</span></label>
              <input type="text" id="username" className="form-control" placeholder="Enter your username" value={formData.username} onChange={handleChange} required />
              {errors.username && <div className="error">{errors.username}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password<span className="sp-red"> *</span></label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <div className="error">{errors.password}</div>}
            </div>
            <div className="mb-3 text-start">
              <a href="#" className="text-decoration-none" onClick={toggleForgotPassword}>
                Forgot password or username?
              </a>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Sign In</button>
            </div>
            <div className="mt-3 text-center">
              <p>Not enrolled? <a href="/register" className="text-decoration-none">Sign Up</a></p>
            </div>
            {errors.login && <div className="error">{errors.login}</div>}
          </form>
        </div>
      </div>

      {showForgotPassword && <ForgotPassword toggleForgotPassword={toggleForgotPassword} />}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login Successful!</h5>
              </div>
              <div className="modal-body text-center">
                <img src={successImage} alt="Success" style={{ width: '100px' }} />
                <p className="mt-3">Login successful! Redirecting to dashboard in {countdown} seconds...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
