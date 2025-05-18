import React, { useState } from 'react';
import axios from 'axios';
import '../css/Register.css';
import '../css/SuccessModel.css';
import '../css/ErrorModel.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import leftImage from '../assets/image.jpg';
import successImage from '../assets/success.png';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    mobileNumber: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    const newErrors = [];
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const usernamePattern = /^[a-zA-Z0-9]{3,}$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    const namePattern = /^[a-zA-Z]{2,}$/;
    const mobileNumberPattern = /^[0-9]{10}$/;

    if (!emailPattern.test(formData.email)) {
      newErrors.push('Invalid email address');
    }
    if (!usernamePattern.test(formData.username)) {
      newErrors.push('Username must be at least 3 characters and alphanumeric');
    }
    if (!passwordPattern.test(formData.password)) {
      newErrors.push('Password must be at least 8 characters, include an uppercase letter and a number');
    }
    if (!namePattern.test(formData.firstName)) {
      newErrors.push('First name must be at least 2 characters and contain only letters');
    }
    if (!namePattern.test(formData.lastName)) {
      newErrors.push('Last name must be at least 2 characters and contain only letters');
    }
    if (!mobileNumberPattern.test(formData.mobileNumber)) {
      newErrors.push('Mobile number must be exactly 10 digits');
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (formErrors.length > 0) {
      setErrorMessage(formErrors.join(', '));
      setShowErrorModal(true);
    } else {
      try {
        await axios.post('http://localhost:8080/customer/register', formData);
        setShowSuccessModal(true);
        const timer = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);
        setTimeout(() => {
          clearInterval(timer);
          window.location.href = '/login';
        }, 3000);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const message = error.response.data;
          setErrorMessage(message);
          setShowErrorModal(true);
        } else {
          setErrorMessage('Registration failed!');
          setShowErrorModal(true);
        }
      }
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="register-container">
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-image">
          <img src={leftImage} alt="Registration" />
        </div>
        <div className="form-content">
          <h3 className="text-center mb-3">Create an Account</h3>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address<span className="sp-red"> *</span></label>
            <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username<span className="sp-red"> *</span></label>
            <input type="text" className="form-control" id="username" value={formData.username} onChange={handleChange} placeholder="Enter your username" required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password<span className="sp-red"> *</span></label>
            <div className="input-group">
              <input type={showPassword ? "text" : "password"} className="form-control" id="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
              <button type="button" className="btn btn-secondary" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="mb-3 form-inline">
            <div className="inline-field">
              <label htmlFor="firstName" className="form-label">First Name<span className="sp-red"> *</span></label>
              <input type="text" className="form-control" id="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" required />
            </div>
            <div className="inline-field">
              <label htmlFor="lastName" className="form-label">Last Name<span className="sp-red"> *</span></label>
              <input type="text" className="form-control" id="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" required />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="mobileNumber" className="form-label">Mobile Number<span className="sp-red"> *</span></label>
            <input type="tel" className="form-control" id="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="Enter your mobile number" required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
          <p className="text-center mt-1">
            Already enrolled? <a className="text-decoration-none" href="/login">Sign In</a>
          </p>
        </div>
      </form>

      {showSuccessModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Registration Successful!</h5>
                <button type="button" className="close" aria-label="Close" onClick={handleCloseSuccessModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body text-center">
                <img src={successImage} alt="Success" style={{ width: '100px' }} />
                <p className="mt-3">Registration successful! Redirecting to login in {countdown} seconds...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Error</h5>
                <button type="button" className="close" aria-label="Close" onClick={handleCloseErrorModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body text-center">
                <p>{errorMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
