import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userRedux";
import { useNavigate } from "react-router-dom";

const FaydaLogin = () => {
  const [fcn, setFcn] = useState("");
  const [otp, setOtp] = useState("");
  const [transactionId, setTransactionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Step 1: Initiate OTP
  const handleInitiate = async () => {
    if (!fcn || fcn.length !== 16) return toast.error("Enter valid 16-digit Fayda Card Number");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/fayda/initiate", { fcn });
      setTransactionId(data.result.transactionId);
      toast.success("OTP sent to your registered phone number");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initiate Fayda login");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerify = async () => {
    if (!otp || !transactionId) return toast.error("Enter OTP first");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/fayda/verify", {
        fcn,
        otp,
        transactionId,
      });

      const { user, token } = data;

      // Save user in Redux
      dispatch(loginSuccess({ user, token }));

      toast.success("Fayda login successful");

      // 🔹 Redirect logic (same as ProtectedRoute)
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "member") {
        if (user.membershipStatus !== "approved") {
          navigate("/membership-form"); // not approved member
        } else {
          navigate("/member-dashboard");
        }
      } else if (user.role === "user") {
        if (user.membershipStatus === "pending") {
          navigate("/membership-form");
        } else if (user.membershipStatus === "approved") {
          navigate("/member-dashboard");
        } else {
          navigate("/membership-form"); // default for user
        }
      } else {
        navigate("/"); // fallback
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fayda-login">
      {!transactionId ? (
        <>
          <input
            type="text"
            placeholder="Enter Fayda Card Number"
            value={fcn}
            onChange={(e) => setFcn(e.target.value)}
            maxLength={16}
            className="form-control mb-2"
          />
          <button
            onClick={handleInitiate}
            className="bbttnn w-100"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="form-control mb-2"
          />
          <button
            onClick={handleVerify}
            className="bbttnn w-100"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}
    </div>
  );
};

export default FaydaLogin;
