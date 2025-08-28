// src/pages/VerifyOtpPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // 🔹 Automatically resend OTP when page loads
  useEffect(() => {
    if (!email) {
      toast.error("Invalid access — please login again.");
      navigate("/login");
      return;
    }

    const sendOtp = async () => {
      try {
        const { data } = await axios.post("http://localhost:5000/api/auth/resend-otp", { email });
        toast.success(data.message || "OTP has been sent to your email.");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to send OTP.");
      }
    };

    sendOtp();
  }, [email, navigate]);

  // 🔹 Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });
      toast.success(data.message || "Account verified! You can now login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP, please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Resend OTP button
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("http://localhost:5000/api/auth/resend-otp", { email });
      toast.success(data.message || "OTP resent to your email.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-3">Verify Your Account</h2>
        <p className="text-center text-muted">
          An OTP has been sent to your email <strong>{email}</strong>.
        </p>

        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            maxLength="6"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="form-control mb-3"
            autoFocus
          />
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-3">
          <button
            onClick={handleResendOtp}
            className="btn btn-link text-decoration-none"
            disabled={loading}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
