import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/Pages.css'

const Contact = () => {
  return (
    <>
      <Navbar />
      <div className="contact-page">
        <div className="container">
          <h2><i className="fas fa-envelope"></i> Contact Us</h2>
          <p className="intro">We’re here to help. Reach out to us through any of the following methods, and we’ll get back to you promptly.</p>

          <div className="contact-methods">
            <div className="contact-item">
              <i className="fas fa-phone-alt"></i>
              <h4>Phone</h4>
              <p>+91 98765 43210 (Mon–Sat: 9 AM to 6 PM)</p>
            </div>

            <div className="contact-item">
              <i className="fas fa-envelope-open-text"></i>
              <h4>Email</h4>
              <p>support@mitrabank.com</p>
            </div>

            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <h4>Visit Us</h4>
              <p>Mitra Bank HQ, 3rd Floor, Tech Towers, Bengaluru, India</p>
            </div>

            <div className="contact-item">
              <i className="fas fa-comments"></i>
              <h4>Chat Support</h4>
              <p>Click on the chat icon at the bottom-right to start a conversation.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
