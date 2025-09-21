import fs from 'fs';
import path from 'path';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Upload profile picture
export const uploadProfilePicture = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new Error('User not found');
  if (!req.file) throw new Error('No file uploaded');

  // Delete old picture if exists and not default
  if (user.profilePicture && user.profilePicture !== 'default-profile.png') {
    const oldPath = path.join(process.cwd(), 'uploads/profilePictures', user.profilePicture);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  // Save new filename only
  user.profilePicture = req.file.filename;
  await user.save();

  // Return full updated user object
  res.json({ message: 'Profile picture uploaded', user });
});

// Get profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) throw new Error('User not found');
  res.json(user);
});

export const removeProfilePicture = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new Error('User not found');

  if (user.profilePicture && user.profilePicture !== 'default-profile.png') {
    const oldPath = path.join(process.cwd(), 'uploads/profilePictures', user.profilePicture);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  user.profilePicture = 'default-profile.png';
  await user.save();

  res.json({ message: 'Profile picture removed', profilePicture: user.profilePicture });
});

// Update profile info
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new Error('User not found');

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;

  await user.save();
  res.json({ message: 'Profile updated successfully', user });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password changed successfully' });
});
