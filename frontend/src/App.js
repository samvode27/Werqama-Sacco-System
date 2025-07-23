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
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/create-news" element={
              <ProtectedRoute role="admin">
                <CreateNewsPage />
              </ProtectedRoute>
            } />
            <Route path="/savings" element={
              <ProtectedRoute role="member">
                <SavingsPage />
              </ProtectedRoute>
            } />
            <Route path="/loans" element={
              <ProtectedRoute role="member">
                <LoanPage />
              </ProtectedRoute>
            } />
            <Route path="/admin-loans" element={
              <ProtectedRoute role="admin">
                <LoanPage />
              </ProtectedRoute>
            } />
            <Route path="/admin-savings" element={
              <ProtectedRoute role="admin">
                <AdminSavingsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin-dashboard" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/member-dashboard" element={
              <ProtectedRoute role="member">
                <MemberDashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/savings" element={
                <ProtectedRoute>
                  <SavingsPage />
                </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
