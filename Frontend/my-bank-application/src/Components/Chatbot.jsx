import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [faqVisible, setFaqVisible] = useState(false);
  const navigate = useNavigate();

  const faqs = [
    { question: "Transfer Money", answer: "Securely transfer funds to a beneficiary.", path: "/transaction" },
    { question: "Add Beneficiary", answer: "Add and manage your beneficiaries.", path: "/beneficiary" },
    { question: "Check Minimum Balance", answer: "Your account type determines the minimum balance requirement.", path: "/dashboard" },
    { question: "Apply for Loan", answer: "Check loan eligibility and apply here.", path: "/homeloan" },
    { question: "Reset Password", answer: "Update your security settings.", path: "/updatepassword" },
    { question: "Deposit Money", answer: "Deposit funds quickly and safely.", path: "/deposite" },
    { question: "Transaction History", answer: "View your past transactions.", path: "/history" },
    { question: "Apply for a Debit/Credit Card", answer: "Apply and manage your cards here.", path: "/cards" },
    { question: "Update Profile", answer: "Modify your personal details.", path: "/updateprofile" },
    { question: "Agriculture Loan", answer: "Check loan options for farming needs.", path: "/agreecultureloan" },
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleFaqClick = (faq) => {
    setQuery(faq.question);
    setResponse(
      <>
        {faq.answer} <br />
        <button className="redirect-btn" onClick={() => navigate(faq.path)}>Click Here</button>
      </>
    );
  };

  const handleSubmit = () => {
    const matchedFaq = faqs.find(faq => query.toLowerCase().includes(faq.question.toLowerCase()));
    if (matchedFaq) {
      setResponse(
        <>
          {matchedFaq.answer} <br />
          <button className="redirect-btn" onClick={() => navigate(matchedFaq.path)}>Click Here</button>
        </>
      );
    } else {
      setResponse("I'm sorry, I don't have an answer for that.");
    }
  };

  return (
    <div>
      {/* Floating Button for Minimal Mode */}
      <button className="chatbot-button" onClick={handleToggle}>
        💬 Chat
      </button>

      {/* Full HV Chatbot Container */}
      <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <h3>Bank Assistant</h3>
          <button onClick={handleToggle} className="close-btn">✖</button>
        </div>

        <div className="chatbot-body">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..."
          />
          <button className="send-btn" onClick={handleSubmit}>Send</button>
          <p className="response">{response}</p>

          {/* FAQ Section */}
          <button onClick={() => setFaqVisible(!faqVisible)} className="faq-btn">
            {faqVisible ? "Hide FAQs" : "Show FAQs"}
          </button>
          {faqVisible && (
            <ul className="faq-list">
              {faqs.map((faq, index) => (
                <li key={index} onClick={() => handleFaqClick(faq)}>{faq.question} ➝</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
