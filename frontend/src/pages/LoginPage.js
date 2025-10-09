// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { Form, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saccoLogin } from "../redux/apiCalls";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaCreditCard } from "react-icons/fa";
import FaydaLogo from "../../src/assets/f.jpg";
import Logo from "../assets/logo.jpg";
import FaydaLogin from "../components/FaydaLogin"; // Fayda login component
import "../styles/Auth.css";

const LoginPage = () => {
  const [useFaydaLogin, setUseFaydaLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFetching } = useSelector((state) => state.user);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      const { token, user } = await saccoLogin(dispatch, { email, password });
      if (!user) return;

      if (!user.isVerified) {
        toast.error("Your account is not verified. Please check your email.");
        return;
      }

      // Redirect based on role
      if (user.role === "admin") navigate("/admin-dashboard");
      else if (user.role === "member") navigate("/member-dashboard");
      else if (user.role === "user") navigate("/membership-form");
      else navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      <div className="login-wrapper">
        <Card className="auth-card">
          {/* Logo */}
          <div className="logo-container">
            <img src={Logo} alt="Werqama Sacco Logo" className="auth-logo" />
            <h4 className="brand-title">WERQAMA SACCOS Ltd.</h4>
          </div>

          {/* Login Type Buttons */}
          <div className="login-methods mb-4">
            <button
              className={`login-method-btn ${!useFaydaLogin ? "active" : ""}`}
              onClick={() => setUseFaydaLogin(false)}
            >
              <FaEnvelope className="icon" />
              Continue with Email
            </button>
            <button
              className={`toggle-btn ${useFaydaLogin ? "active" : ""}`}
              onClick={() => setUseFaydaLogin(true)}
            >
              <img src={FaydaLogo} alt="Fayda" className="icon" /> Continue with Fayda
            </button>
          </div>

          {!useFaydaLogin ? (
            // Email login form
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <div className="password-container">
                  <Form.Control
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>

              <p className="text-end mb-3">
                <Link to="/forgot-password" className="link-text">
                  Forgot Password?
                </Link>
              </p>

              <button type="submit" className="bbttnn w-100" disabled={isFetching}>
                {isFetching ? "Logging in..." : "Login"}
              </button>

              <p className="mt-3 text-center">
                Don’t have an account?{" "}
                <Link to="/register" className="link-text">
                  Register
                </Link>
              </p>
            </Form>
          ) : (
            // Fayda login
            <FaydaLogin />
          )}
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
