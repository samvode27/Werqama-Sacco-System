import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// Step 1: Start Fayda auth - guide user
export const startFaydaAuth = asyncHandler(async (req, res) => {
  const { fcn } = req.body;

  if (!fcn || fcn.length !== 16) {
    return res.status(400).json({ message: "Please provide a valid 16-digit Fayda Card Number." });
  }

  let user = await User.findOne({ faydaNumber: fcn });
  if (!user) {
    user = await User.create({
      faydaNumber: fcn,
      name: "Fayda User",
      isFaydaVerified: false,
      role: "user",
    });
  }

  res.status(200).json({
    success: true,
    message: "Please complete OTP verification on the official Fayda portal.",
    faydaPortalUrl: `https://fayda-auth.vercel.app/?fcn=${fcn}`,
  });
});

// Step 2: Verify Fayda after portal confirmation
export const verifyFaydaAuth = asyncHandler(async (req, res) => {
  const { fcn, confirmationCode } = req.body;

  if (!fcn || !confirmationCode) {
    return res.status(400).json({ message: "FCN and confirmation code are required" });
  }

  const user = await User.findOne({ faydaNumber: fcn });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isFaydaVerified = true;
  await user.save();

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
});
