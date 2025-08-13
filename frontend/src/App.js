// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NewsPage from './pages/NewsPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import CreateNewsPage from './pages/CreateNewsPage';
import SavingsPage from './pages/SavingsPage';
import LoanPage from './pages/LoanPage';
import AdminSavingsPage from './pages/AdminSavingsPage';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import AdminLoansPage from './pages/AdminLoansPage';
import ForgotPasswordPage from '../src/components/ForgotPasswordPage'
import ResetPasswordPage from '../src/components/ResetPasswordPage'
import BecomeMembershipFormPage from './pages/BecomeMembershipFormPage';
import AdminMembershipApprovalPage from './pages/AdminMembershipApprovalPage';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            <Route path="/news" element={<NewsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route path="/membership-form" element={<BecomeMembershipFormPage />} />

            <Route path="/savings" element={<ProtectedRoute role={['member', 'user']}><SavingsPage /></ProtectedRoute>} />
            <Route path="/loans" element={<ProtectedRoute role={['member', 'user']}><LoanPage /></ProtectedRoute>} />
            <Route path="/member-dashboard" element={<ProtectedRoute role={['member', 'user']}><MemberDashboard /></ProtectedRoute>} />

            <Route path="/create-news" element={<ProtectedRoute role="admin"><CreateNewsPage /></ProtectedRoute>} />
            <Route path="/admin-loans" element={<ProtectedRoute role="admin"><AdminLoansPage /></ProtectedRoute>} />
            <Route path="/admin-savings" element={<ProtectedRoute role="admin"><AdminSavingsPage /></ProtectedRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin-membership-approvals" element={<AdminMembershipApprovalPage />} />

            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
