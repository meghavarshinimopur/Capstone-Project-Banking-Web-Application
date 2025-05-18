import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ForgotPassword = ({ toggleForgotPassword }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="forgotPasswordModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-4" id="forgotPasswordModalLabel">Forgot Password</h1>
            <button type="button" className="btn-close" onClick={toggleForgotPassword} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <h4 className="text-muted mb-4">Please enter your registered email address.</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" onClick={toggleForgotPassword}>Go Back</button>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
