// src/pages/ForgotPasswordPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [timer, setTimer] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0 && codeSent) {
      setDisabled(true);
    }
    return () => clearInterval(interval);
  }, [timer, codeSent]);

  // Send reset code
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');

    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('6-digit reset code sent to your email.');
      setCodeSent(true);
      setDisabled(false);
      setOtp(['', '', '', '', '', '']);
      setTimer(5 * 60); // 5 minutes
      inputsRef.current[0]?.focus();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to send reset code.');
    }
  };

  // OTP input change
  const handleOtpChange = (e, idx) => {
    if (disabled) return;
    const val = e.target.value;
    if (!/^[0-9]?$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);

    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  // OTP backspace
  const handleOtpKeyDown = (e, idx) => {
    if (disabled) return;
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  // Verify OTP and reset password
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (otp.join('').length !== 6) return toast.error('Enter complete 6-digit code');
    if (!newPassword) return toast.error('Enter a new password');

    try {
      await api.post('/auth/reset-password', {
        email,
        code: otp.join(''),
        password: newPassword,
      });
      toast.success('Password updated successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="forgot-container d-flex justify-content-center align-items-center min-vh-100 p-3">
      {/* ✅ Toast container */}
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      
      <div className="p-4 border rounded shadow-sm" style={{ width: '360px', maxWidth: '100%' }}>
        <h4 className="mb-4 text-center">{codeSent ? 'Reset Password' : 'Forgot Password'}</h4>

        {!codeSent ? (
          <form onSubmit={handleSendCode}>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control py-2"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Send Reset Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <div className="mb-3 text-center">
              <label className="form-label">Enter 6-digit code</label>
              <div className="d-flex justify-content-between otp-inputs">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength="1"
                    className="form-control text-center"
                    value={digit}
                    ref={(el) => (inputsRef.current[idx] = el)}
                    onChange={(e) => handleOtpChange(e, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    disabled={disabled}
                    style={{ width: '45px', fontSize: '1.5rem', margin: '0 3px' }}
                  />
                ))}
              </div>
              <small className="text-muted d-block mt-2">
                {disabled
                  ? 'Code expired. Please resend.'
                  : `Expires in ${String(Math.floor(timer / 60)).padStart(2,'0')}:${String(timer % 60).padStart(2,'0')}`}
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control py-2"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-danger w-100" disabled={disabled}>
              Reset Password
            </button>

            {disabled && (
              <button
                type="button"
                className="btn btn-secondary w-100 mt-2"
                onClick={handleSendCode}
              >
                Resend Code
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
