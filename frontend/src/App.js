import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import AdminLoansPage from './pages/AdminLoansPage';
import BecomeMembershipFormPage from './pages/BecomeMembershipFormPage';
import AdminMembershipApprovalPage from './pages/AdminMembershipApprovalPage';

import { LanguageProvider } from './contexts/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';
import VerifyOtpPage from './pages/VerifyOtpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminManageMembersPage from './pages/AdminManageMembersPage';
import AdminSavingsAnalytics from './pages/AdminSavingsAnalytics';
import MemberSavingsPage from './pages/MemberSavingsPage';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div className="text-center py-5">Loading...</div>} persistor={persistor}>
        <LanguageProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-otp" element={<VerifyOtpPage />} />

              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              <Route path="/news" element={<NewsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/contact" element={<ContactPage />} />

              <Route
                path="/membership-form"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <BecomeMembershipFormPage />
                  </ProtectedRoute>
                }
              />

              {/* Member/User */}
              <Route
                path="/savings"
                element={
                  <ProtectedRoute allowedRoles={["member"]}>
                    <SavingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/loans"
                element={
                  <ProtectedRoute allowedRoles={["member"]}>
                    <LoanPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/member-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["member", "user"]}>
                    <MemberDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin */}
              <Route
                path="/create-news"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <CreateNewsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-loans"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminLoansPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-savings"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminSavingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-membership-approvals"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminMembershipApprovalPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin-saving-analytics"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminSavingsAnalytics />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/member-saving-analytics"
                element={
                  <ProtectedRoute allowedRoles={["member"]}>
                    <MemberSavingsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/manage-members"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminManageMembersPage />
                  </ProtectedRoute>
                }
              />

              {/* Any logged-in user */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Routes>

            {/* ✅ Global ToastContainer */}
            <ToastContainer position="top-center" autoClose={3000} theme="colored" />
          </Router>
        </LanguageProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
