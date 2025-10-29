// backend/routes/statsRoutes.js
import express from 'express';
import User from '../models/User.js';
import MembershipApplication from '../models/MembershipApplication.js';
import LoanApplication from '../models/LoanApplication.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Count of approved members (status = approved)
    const approvedMembers = await MembershipApplication.countDocuments({ status: 'approved' });

    // Optional: Only count those linked to users with role 'member'
    const memberUsers = await User.countDocuments({ role: 'member' });

    // Count of approved loans
    const approvedLoans = await LoanApplication.countDocuments({ status: 'approved' });

    res.json({
      success: true,
      memberCount: approvedMembers || memberUsers,
      loanCount: approvedLoans,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

export default router;
