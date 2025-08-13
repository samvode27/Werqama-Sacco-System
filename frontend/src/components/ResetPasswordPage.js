import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { isStrongPassword } from '../utils/passwordValidator';

function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  if (!isStrongPassword(password)) {
    toast.error(
      'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
    );
    return;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password updated! Login now.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            className="form-control mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <small className="text-muted">
            Must include uppercase, lowercase, number, special character, and be at least 8 characters.
          </small>

          <button className="btn btn-success" type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
