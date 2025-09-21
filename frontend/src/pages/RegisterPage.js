// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import api from "../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../styles/Auth.css";
import Logo from "../assets/logo.jpg"; // <-- use your logo

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    uppercase: false,
    lowercase: false,
    number: false,
    minLength: false,
    specialChar: false,
  });

  const validateName = (value) => {
    if (!value.trim()) return "Full name is required";
    if (!/^[A-Za-z\s]+$/.test(value)) return "Name can only contain letters and spaces";
    if (value.trim().length < 3) return "Name must be at least 3 characters";
    return "";
  };

  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "name") {
      setErrors((prev) => ({ ...prev, name: validateName(value) }));
    }
    if (name === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
    if (name === "password") {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
      setPasswordCriteria({
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
        minLength: value.length >= 8,
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Final validation check
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (nameError || emailError || passwordError) {
      setErrors({ name: nameError, email: emailError, password: passwordError });
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", formData);
      toast.success(data.message || "Registered! OTP sent to your email.");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!formData.otp) return toast.error("Enter OTP");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });
      toast.success(data.message || "Account verified! You can login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Resend OTP
  const handleResendOTP = async () => {
    if (!formData.email) {
      return toast.error("Email missing. Please register again.");
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/resend-otp", { email: formData.email });
      toast.success(data.message || "OTP resent to your email.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      <div className="auth-wrapper">
        <div className="auth-container">
          {/* Logo Section */}
          <div className="logo-container">
            <img src={Logo} alt="Werqama Sacco Logo" className="auth-logo" />
            <h4 className="brand-title">WERQAMA SACCOS Ltd.</h4>
          </div>

          {step === 1 && (
            <>
              <h2 className="mb-4">Create Account</h2>
              <form onSubmit={handleRegister}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                />
                {errors.name && <div className="error-text">{errors.name}</div>}

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                />
                {errors.email && <div className="error-text">{errors.email}</div>}

                <div className="password-container">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && <div className="error-text">{errors.password}</div>}

                {/* Password Criteria */}
                <ul className="password-criteria">
                  <li className={passwordCriteria.uppercase ? "valid" : "invalid"}>
                    {passwordCriteria.uppercase ? <FaCheckCircle /> : <FaTimesCircle />} Uppercase Letter
                  </li>
                  <li className={passwordCriteria.lowercase ? "valid" : "invalid"}>
                    {passwordCriteria.lowercase ? <FaCheckCircle /> : <FaTimesCircle />} Lowercase Letter
                  </li>
                  <li className={passwordCriteria.number ? "valid" : "invalid"}>
                    {passwordCriteria.number ? <FaCheckCircle /> : <FaTimesCircle />} Number
                  </li>
                  <li className={passwordCriteria.minLength ? "valid" : "invalid"}>
                    {passwordCriteria.minLength ? <FaCheckCircle /> : <FaTimesCircle />} Min 8 Characters
                  </li>
                  <li className={passwordCriteria.specialChar ? "valid" : "invalid"}>
                    {passwordCriteria.specialChar ? <FaCheckCircle /> : <FaTimesCircle />} Special Character
                  </li>
                </ul>

                <button type="submit" className="bbttnn w-100" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>
              <p className="mt-3 text-center">
                Already have an account?{" "}
                <Link to="/login" className="link-text">
                  Login
                </Link>
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="mb-4">Verify OTP</h2>
              <form onSubmit={handleVerifyOTP}>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  className="form-control"
                />
                <button type="submit" className="btn btn-success w-full mt-2" disabled={loading}>
                  {loading ? "Verifying..." : "Verify"}
                </button>
              </form>
              <p className="mt-3 text-center">
                Didn’t receive OTP?{" "}
                <button className="btn btn-link" onClick={handleResendOTP} disabled={loading}>
                  Resend OTP
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
