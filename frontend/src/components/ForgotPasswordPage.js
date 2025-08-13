import React, { useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Reset link sent. Check your email.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending reset link');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control mb-3"
            required
          />
          <button className="btn btn-primary" type="submit">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
