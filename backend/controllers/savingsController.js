import asyncHandler from 'express-async-handler';
import Saving from '../models/Saving.js';

// @desc Get current user's savings
// @route GET /api/savings/mine
// @access Private
export const getMySavings = asyncHandler(async (req, res) => {
    const savings = await Saving.find({ member: req.user._id }).sort({ date: -1 });
    res.json(savings);
});
