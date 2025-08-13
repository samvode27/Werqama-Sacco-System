import asyncHandler from 'express-async-handler';
import Saving from '../models/Saving.js';

export const getMySavings = asyncHandler(async (req, res) => {
    const savings = await Saving.find({ member: req.user._id }).sort({ date: -1 });
    res.json(savings);
});
