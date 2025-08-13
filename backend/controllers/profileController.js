import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';

export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.prefersSMS = req.body.prefersSMS !== undefined ? req.body.prefersSMS : user.prefersSMS;
        user.prefersEmail = req.body.prefersEmail !== undefined ? req.body.prefersEmail : user.prefersEmail;
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
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export const changePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { currentPassword, newPassword } = req.body;

    if (user && (await user.matchPassword(currentPassword))) {
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(400);
        throw new Error('Current password is incorrect');
    }
});

export const uploadProfilePicture = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.profilePicture = req.file.path;
        await user.save();
        res.json({ message: 'Profile picture uploaded', profilePicture: user.profilePicture });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});
