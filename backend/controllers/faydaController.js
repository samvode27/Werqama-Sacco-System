import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { initiateFaydaOTP, verifyFaydaOTP, getFaydaUser } from "../utils/faydaService.js";

// 1️⃣ Initiate OTP
export const startFaydaAuth = asyncHandler(async (req, res) => {
  const { fcn } = req.body;
  if (!fcn || fcn.length !== 16) {
    return res.status(400).json({ message: "Please provide a valid 16-digit Fayda Card Number." });
  }

  try {
    const result = await initiateFaydaOTP(fcn);
    res.status(200).json({
      message: "OTP sent to your Fayda registered phone number",
      result
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 2️⃣ Verify OTP
export const verifyFaydaAuth = asyncHandler(async (req, res) => {
  const { transactionId, otp, fcn } = req.body;
  if (!transactionId || !otp || !fcn) {
    return res.status(400).json({ message: "transactionId, otp, and fcn are required" });
  }

  try {
    const verifyRes = await verifyFaydaOTP({ transactionId, otp, fcn });

    if (!verifyRes.success) {
      return res.status(400).json({ message: verifyRes.message || "Verification failed" });
    }

    // Get Fayda user info
    const faydaUserData = verifyRes.user || await getFaydaUser(fcn);

    // Create or update local user
    let user = await User.findOne({ faydaNumber: fcn });
    if (!user) {
      user = await User.create({
        faydaNumber: fcn,
        name: faydaUserData?.fullName?.[0]?.value || "Fayda User",
        isFaydaVerified: true,
        role: "user",
      });
    } else {
      user.isFaydaVerified = true;
      await user.save();
    }

    const token = user.getSignedJwtToken();
    res.json({
      success: true,
      message: "Fayda verification successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        faydaNumber: user.faydaNumber,
        isFaydaVerified: user.isFaydaVerified,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
