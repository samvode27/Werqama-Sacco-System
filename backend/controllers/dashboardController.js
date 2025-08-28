import User from '../models/User.js';
import Saving from '../models/Saving.js';
import Loan from '../models/LoanApplication.js';

export const getAdminDashboardStats = async (req, res) => {
    try {
        const totalMembers = await User.countDocuments({ role: 'member' });
        const totalSavings = await Saving.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
        const activeLoans = await Loan.countDocuments({ status: 'approved' });
        const pendingLoans = await Loan.countDocuments({ status: 'pending' });

        res.json({
            totalMembers,
            totalSavings: totalSavings[0]?.total || 0,
            activeLoans,
            pendingLoans,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMemberDashboardStats = async (req, res) => {
    try {
        const totalSavings = await Saving.aggregate([
            { $match: { member: req.user._id } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const activeLoans = await Loan.aggregate([
            { $match: { member: req.user._id, status: 'approved', repaymentStatus: 'ongoing' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        res.json({
            totalSavings: totalSavings[0]?.total || 0,
            activeLoans: activeLoans[0]?.total || 0,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
