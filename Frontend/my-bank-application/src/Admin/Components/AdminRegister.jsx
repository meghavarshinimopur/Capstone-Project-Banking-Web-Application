import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../../css/SuccessModel.css';
import successImage from '../../assets/success.png'; // Ensure the success image exists

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const usernamePattern = /^[a-zA-Z0-9]{3,}$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
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
        await axios.post('http://localhost:8080/admin/register', formData);
        localStorage.setItem('admin', JSON.stringify(formData));
        setShowModal(true);
        const timer = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);
        setTimeout(() => {
          clearInterval(timer);
          window.location.href = '/adminlogin'; // Redirect to admin login
        }, 3000);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setErrors({ register: 'Registration failed!' });
        } else {
          alert('An error occurred during registration.');
        }
      }
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: 'white' }}>
      <div className="row w-100 g-0 shadow-lg rounded overflow-hidden" style={{ maxWidth: '900px' }}>
        <div className="col-md-6 bg-primary text-white d-flex flex-column justify-content-center align-items-center p-5">
          <div className="content-left text-center">
            <h1>Welcome!</h1>
            <p className="lead">Create your admin account to manage the system.</p>
            <p><strong style={{ fontSize: '30px', fontWeight: 600 }}>Admin Panel</strong></p>
          </div>
        </div>
        <div className="col-md-6 bg-primary d-flex flex-column justify-content-center align-items-center p-4">
          <form className="p-5 rounded bg-light shadow" style={{ width: '100%', maxWidth: '450px' }} onSubmit={handleSubmit}>
            <h3 className="text-left mb-4">Admin Registration</h3>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address<span className="sp-red"> *</span></label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username<span className="sp-red"> *</span></label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
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
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Sign Up</button>
            </div>
            <div className="mt-3 text-center">
              <p>Already registered? <a href="/adminlogin" className="text-decoration-none">Login</a></p>
            </div>
            {errors.register && <div className="error">{errors.register}</div>}
          </form>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Registration Successful!</h5>
              </div>
              <div className="modal-body text-center">
                <img src={successImage} alt="Success" style={{ width: '100px' }} />
                <p className="mt-3">Redirecting to login in {countdown} seconds...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRegister;
