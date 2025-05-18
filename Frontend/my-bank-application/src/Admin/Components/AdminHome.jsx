import React from 'react';
import '../../css/Home.css';

const AdminHome = () => {
  return (
    <div className="container-fluid d-flex align-items-center justify-content-space-between g-0">
      <div className="row w-100 p-5 bg-primary">
        <div className="col-md-8 d-flex align-items-center justify-content-center g-0" style={{ color: '#fff' }}>
          <div className="content-left">
            <h2>Welcome to Our Website!</h2>
            <h5>Enjoy!</h5>
            <p>
              <strong style={{ fontSize: '50px', fontWeight: '600' }}>₹2500</strong>
            </p>
          </div>
        </div>
        <div className="col-md-4 d-flex align-items-center justify-content-center">
          <div className="form-container" style={{ width: '350px', height: '200px' }}>
            <form action="#" method="POST">
              <h3 className="mb-4">Welcome</h3>
              <a href="/adminlogin" className="btn btn-primary btn-block mb-4">
                Sign In
              </a>
              <p>
                Not enrolled? <a href="/adminregister">Sign up</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
