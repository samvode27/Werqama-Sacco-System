// backend/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema(
  {
    // Basic profile
    name: { type: String },
    email: { type: String, unique: true, sparse: true }, // optional
    phone: { type: String },
    profilePicture: { type: String, default: 'default-profile.png' },

    // Fayda (primary identity)
    faydaNumber: { type: String, unique: true, sparse: true },
    isFaydaVerified: { type: Boolean, default: false },

    // password is optional now (we're moving to Fayda auth)
    password: { type: String, select: false },

    role: { type: String, enum: ['admin', 'member', 'user'], default: 'user' },

    // legacy OTP fields (kept for backward compatibility during migration)
    isVerified: { type: Boolean, default: false },
    otpCode: String,
    otpExpires: Date,
    otpResendCount: { type: Number, default: 0 },
    otpResendWindow: Date,

    resetToken: String,
    resetTokenExpires: Date,
  },
  { timestamps: true }
);

// Password match - returns false if password not present
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password if present and modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// JWT
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const User = mongoose.model('User', userSchema);
export default User;
