import Saving from '../models/Saving.js';

export const addSaving = async (req, res) => {
    try {
        const { amount, method } = req.body;
        const saving = await Saving.create({
            member: req.user._id,
            amount,
            method,
            status: 'paid',
        });
        res.status(201).json(saving);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMySavings = async (req, res) => {
    try {
        const savings = await Saving.find({ member: req.user._id }).sort({ date: -1 });
        res.json(savings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllSavings = async (req, res) => {
    try {
        const savings = await Saving.find().populate('member', 'name email').sort({ date: -1 });
        res.json(savings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
