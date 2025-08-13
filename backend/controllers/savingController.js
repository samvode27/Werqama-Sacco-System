import Saving from '../models/Saving.js';

// Get all savings with optional filters
export const getAllSavings = async (req, res) => {
    try {
        const { status, memberId, startDate, endDate } = req.query;

        let filter = {};
        if (status) filter.status = status;
        if (memberId) filter.member = memberId;
        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const savings = await Saving.find(filter)
            .populate('member', 'name email')
            .sort({ date: -1 });

        res.json(savings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const approveSaving = async (req, res) => {
    try {
        const saving = await Saving.findById(req.params.id);
        if (!saving) return res.status(404).json({ message: 'Saving not found' });

        saving.status = 'approved';
        saving.adminNotes.push({
            status: 'approved',
            note: req.body.note || 'Approved',
            admin: req.user._id,
        });

        await saving.save();
        res.json({ message: 'Saving approved successfully', saving });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const rejectSaving = async (req, res) => {
    try {
        const saving = await Saving.findById(req.params.id);
        if (!saving) return res.status(404).json({ message: 'Saving not found' });

        saving.status = 'rejected';
        saving.adminNotes.push({
            status: 'rejected',
            note: req.body.note || 'Rejected',
            admin: req.user._id,
        });

        await saving.save();
        res.json({ message: 'Saving rejected successfully', saving });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addManualSaving = async (req, res) => {
    try {
        const { member, amount, method, note } = req.body;
        const saving = new Saving({
            member,
            amount,
            method,
            status: 'approved',
            receipt: req.file?.filename || null,
        });
        if (note) saving.adminNotes.push({ note });
        await saving.save();
        res.status(201).json(saving);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const submitManualSavingByMember = async (req, res) => {
    try {
        const { amount, method } = req.body;
        const saving = new Saving({
            member: req.user._id,
            amount,
            method,
            status: 'pending',
            receipt: req.file?.filename || null,
        });
        await saving.save();
        res.status(201).json({ message: 'Manual saving submitted successfully', saving });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSavingsByMember = async (req, res) => {
    try {
        const savings = await Saving.find({ member: req.params.id }).sort({ date: -1 });
        res.json(savings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getMonthlySavingsAnalytics = async (req, res) => {
    try {
        const result = await Saving.aggregate([
            {
                $match: {
                    status: 'Approved'
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        const formatted = result.map(item => ({
            month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
            totalAmount: item.totalAmount,
            count: item.count
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Failed to fetch savings analytics', error });
    }
};

export const getTotalStatistics = async (req, res) => {
    try {
        const stats = await Saving.aggregate([
            { $match: { status: 'approved' } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    totalCount: { $sum: 1 },
                    avgPerUser: { $avg: "$amount" },
                },
            },
        ]);

        res.json(stats[0] || { totalAmount: 0, totalCount: 0, avgPerUser: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch statistics' });
    }
};


