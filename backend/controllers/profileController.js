import fs from 'fs';
import path from 'path';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const uploadProfilePicture = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) throw new Error('User not found');
  if (!req.file) throw new Error('No file uploaded');

  // Delete old picture if exists and not default
  if (user.profilePicture && user.profilePicture !== 'default-profile.png') {
    const oldPath = path.join(process.cwd(), 'uploads/profilePictures', user.profilePicture);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  user.profilePicture = req.file.filename; // store only filename
  await user.save();

  res.json({ message: 'Profile picture uploaded', profilePicture: user.profilePicture });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) throw new Error('User not found');

  // default if no picture
  if (!user.profilePicture) user.profilePicture = 'default-profile.png';

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

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.prefersSMS =
    req.body.prefersSMS !== undefined ? req.body.prefersSMS : user.prefersSMS;
  user.prefersEmail =
    req.body.prefersEmail !== undefined ? req.body.prefersEmail : user.prefersEmail;

  await user.save();

  res.json({
    message: 'Profile updated successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      prefersSMS: user.prefersSMS,
      prefersEmail: user.prefersEmail,
      profilePicture: user.profilePicture,
    },
  });
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
