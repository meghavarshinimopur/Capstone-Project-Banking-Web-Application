import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/Pages.css'

const About = () => {
  return (
    <>
      <Navbar />
      <div className="about-page">
        <div className="container">
          <h2><i className="fas fa-university"></i> About Mitra Bank</h2>
          <p className="intro">
            At <strong>Mitra Bank</strong>, we believe in empowering every individual with safe, smart, and seamless banking.
            Founded in 2023, we are committed to delivering cutting-edge digital banking services while keeping customers at the heart of everything we do.
          </p>

          <div className="about-sections">
            <div className="about-item">
              <i className="fas fa-bullseye"></i>
              <h4>Our Mission</h4>
              <p>To provide reliable and secure banking solutions with a focus on innovation, transparency, and trust.</p>
            </div>

            <div className="about-item">
              <i className="fas fa-eye"></i>
              <h4>Our Vision</h4>
              <p>To be India’s most customer-centric digital bank offering accessible and personalized financial services.</p>
            </div>

            <div className="about-item">
              <i className="fas fa-hands-helping"></i>
              <h4>Why Choose Us?</h4>
              <ul>
                <li>🔐 Secure digital transactions</li>
                <li>⚡ Fast and responsive support</li>
                <li>📱 Mobile-friendly platform</li>
                <li>💡 Tailored solutions for customers and businesses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
