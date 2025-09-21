import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { sendEmail } from '../utils/emailSender.js';
import { isStrongPassword } from '../utils/passwordValidator.js';
import MembershipApplication from '../models/MembershipApplication.js';
import { sendOtpToFayda, verifyFaydaOtp } from '../utils/faydaService.js';
import FaydaSession from '../models/FaydaSession.js';

export const register = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!isStrongPassword(password)) {
      res.status(400);
      throw new Error(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      password,
      role: "user",
      otpCode: otp,
      otpExpires: Date.now() + 5 * 60 * 1000,
    });

    // Send OTP email
    const message = `
    <p>Hello ${name},</p>
    <p>Your verification code is:</p>
    <h2>${otp}</h2>
    <p>This code will expire in 5 minutes.</p>
  `;
    await sendEmail(user.email, "Verify your SACCO account", message);

    res.status(201).json({
      message: "Registration successful. Please check your email for the OTP to verify your account.",
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
});

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Find user and include password
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your account via OTP before login." });
    }

    // 🔑 Check membership status
    let membershipStatus = "unknown";
    const membership = await MembershipApplication.findOne({ member: user._id });
    if (membership) {
      membershipStatus = membership.status; // "pending" | "approved" | "rejected"
    }

    // 🔑 Generate token
    const token = user.getSignedJwtToken();

    // ✅ Respond with user and membership status
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        membershipStatus, // 👈 frontend uses this
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!user.otpCode || !user.otpExpires) {
    res.status(400);
    throw new Error("No OTP found. Please register again.");
  }

  if (user.otpExpires < Date.now()) {
    res.status(400);
    throw new Error("OTP expired. Please request a new one.");
  }

  if (user.otpCode !== otp) {
    res.status(400);
    throw new Error("Invalid OTP code.");
  }

  // Mark as verified
  user.isVerified = true;
  user.otpCode = undefined;
  user.otpExpires = undefined;
  await user.save();

  // reset resend counters
  user.otpResendCount = 0;
  user.otpResendWindow = undefined;

  res.json({ message: "Account verified successfully. You can now log in." });
});

export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "If this account exists, a new OTP has been sent." });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: "Account already verified." });
  }

  // ✅ Rate limit: max 3 resends per hour
  const now = Date.now();
  if (!user.otpResendWindow || user.otpResendWindow < now) {
    // reset window
    user.otpResendWindow = now + 60 * 60 * 1000; // 1 hour
    user.otpResendCount = 0;
  }

  if (user.otpResendCount >= 3) {
    return res.status(429).json({ message: "Too many OTP requests. Please try again after 1 hour." });
  }

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otpCode = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000; // 10 min
  user.otpResendCount += 1;
  await user.save();

  // Send OTP email
  const message = `
    <p>Hello ${user.name},</p>
    <p>Your new verification code is:</p>
    <h2>${otp}</h2>
    <p>This code will expire in 5 minutes.</p>
  `;
  await sendEmail(user.email, "Resend Verification Code", message);

  res.json({ message: "If this account exists, a new OTP has been sent." });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP and expiration (10 min)
  user.resetToken = otp;
  user.resetTokenExpires = Date.now() + 5 * 60 * 1000;
  await user.save();

  const message = `
    <p>Hello ${user.name},</p>
    <p>Your password reset code is:</p>
    <h2>${otp}</h2>
    <p>This code will expire in 5 minutes.</p>
  `;

  await sendEmail(user.email, 'Password Reset Code', message);
  res.json({ message: 'Password reset code sent to email.' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, code, password } = req.body;

  const user = await User.findOne({
    email,
    resetToken: code,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired code' });

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message:
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
    });
  }

  // Update password and remove OTP
  user.password = password;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successful. Please login.' });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  // Check if user has an approved membership
  const membership = await MembershipApplication.findOne({
    member: req.user._id,
    status: 'approved',
  });

  res.json({
    ...user.toObject(),
    isMember: !!membership, // true if approved membership exists
  });
});

// POST /auth/fayda/initiate
export const initiateFaydaAuth = asyncHandler(async (req, res) => {
  const { faydaNumber } = req.body;
  if (!faydaNumber) {
    return res.status(400).json({ message: 'faydaNumber is required' });
  }

  // ask Fayda to send OTP (response contains a transactionID or we create one)
  const sendResp = await sendOtpToFayda(faydaNumber);
  const transactionId = sendResp.transactionID || sendResp.raw?.response?.transactionID || sendResp.raw?.transactionID || sendResp.raw?.request?.transactionID || (require('uuid').v4());

  // create server-side session so we can track expiry / used
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  await FaydaSession.create({
    transactionId,
    faydaNumber,
    expiresAt,
  });

  res.json({ message: 'OTP sent (if the Fayda number is valid).', transactionId });
});

// POST /auth/fayda/verify
export const verifyFaydaAuth = asyncHandler(async (req, res) => {
  const { faydaNumber, otp, transactionId } = req.body;
  if (!faydaNumber || !otp || !transactionId) {
    return res.status(400).json({ message: 'faydaNumber, otp and transactionId are required' });
  }

  // validate session
  const session = await FaydaSession.findOne({ transactionId, faydaNumber });
  if (!session) return res.status(400).json({ message: 'Invalid or expired transaction' });
  if (session.used || session.expiresAt < new Date()) {
    return res.status(400).json({ message: 'Transaction expired or already used' });
  }

  // call Fayda verify
  const verifyResp = await verifyFaydaOtp({ faydaNumber, otp, transactionID: transactionId });
  if (!verifyResp.success) {
    return res.status(401).json({ message: 'Fayda verification failed', details: verifyResp.raw });
  }

  // success -> find or create user
  let user = await User.findOne({ faydaNumber });
  if (!user) {
    user = await User.create({
      name: verifyResp.identity?.name || undefined,
      faydaNumber,
      isFaydaVerified: true,
      role: 'user',
    });
  } else {
    user.isFaydaVerified = true;
    await user.save();
  }

  // mark session used
  session.used = true;
  await session.save();

  // issue JWT (same method you already use)
  const token = user.getSignedJwtToken();
  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      faydaNumber: user.faydaNumber,
      role: user.role,
      isFaydaVerified: user.isFaydaVerified,
    },
  });
});


