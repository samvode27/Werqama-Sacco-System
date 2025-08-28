// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'member', 'user'], default: 'user' },

    // ✅ New fields for OTP verification
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

// Password match method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
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
