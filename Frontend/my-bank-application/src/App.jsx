import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import Dashboard from './Components/Dashboard';
import Beneficiary from './Components/Beneficiary';
import Transaction from './Components/Transaction';
import TransactionHistory from './Components/TransactionHistory';
import ManageBeneficiary from './Components/ManageBeneficiary';
import BeneficiaryTransactionPage from './Components/BeneficiaryTransactionPage';
import UpdatePassword from './Components/UpdatePassword';
import DisplayDetails from './Components/DisplayDetails';
import UpdateProfile from './Components/UpdateProfile';
import FixedDepositPage from './Components/DepositPage';
import HomeLoanPage from './Components/HomeLoanPage';
import AgricultureLoanPage from './Components/AgricultureLoanPage';
import AdminLogin from './Admin/Components/AdminLogin';
import AdminRegister from './Admin/Components/AdminRegister';
import AdminDashboard from './Admin/Components/AdminDashboard';
import AdminTransaction from './Admin/Components/AdminTransaction';
import AdminBeneficiary from './Admin/Components/AdminBeneficiary';
import AdminCustomerProfile from './Admin/Components/AdminCustomerProfile';
import AdminFDApprovalPage from './Admin/Components/AdminFDApprovalPage';
import AdminAgricultureLoanApprovalPage from './Admin/Components/AdminAgricultureLoanApprovalPage';
import AdminLoanApprovalPage from './Admin/Components/AdminLoanApprovalPage';
import AdminCardApprovalPage from './Admin/Components/AdminCardApprovalPage';
import CardApplication from './Components/CardApplication';
import DebitCard from './Components/DebitCard';
import CardViewer from './Components/CardViewer';
import AdminHome from './Admin/Components/AdminHome';
import Chatbot from './Components/Chatbot';
import About from './Components/About';
import Contact from './Components/Contact';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login" element={<Chatbot />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/beneficiary" element={<Beneficiary />} />
        <Route path="/manage-beneficiary" element={<ManageBeneficiary />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/beneficiary-transaction" element={<BeneficiaryTransactionPage />} />
        <Route path="/history" element={<TransactionHistory />} />
        <Route path="/updatepassword" element={<UpdatePassword />} />
        <Route path="/viewprofile" element={<DisplayDetails />} />
        <Route path="/updateprofile" element={<UpdateProfile />} />
        <Route path="/deposite" element={<FixedDepositPage />} />
        <Route path="/homeloan" element={<HomeLoanPage />} />
        <Route path="/agreecultureloan" element={<AgricultureLoanPage />} />
        <Route path="/cards" element={<CardApplication />} />
        <Route path="/card" element={<DebitCard />} />
        <Route path="/card1" element={<CardViewer />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />


        {/*--------------------- Admin Part -----------------*/}
        <Route path="/adminhome" element={<AdminLoanApprovalPage />} />
        <Route path="/admincard" element={<AdminCardApprovalPage />} />
        <Route path="/adminagree" element={<AdminAgricultureLoanApprovalPage />} />
        <Route path="/adminfd" element={<AdminFDApprovalPage />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/adminregister" element={<AdminRegister />} />
        <Route path="/admindash" element={<AdminDashboard />} />
        <Route path="/admin/history" element={<AdminTransaction />} />
        <Route path="/admin/beni" element={<AdminBeneficiary />} />
        <Route path="/admin/customers" element={<AdminCustomerProfile />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;