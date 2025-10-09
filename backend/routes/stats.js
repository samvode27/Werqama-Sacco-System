import express from 'express';
import MembershipApplication from '../models/membership.js';
import LoanApplication from '../models/loan.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const memberCount = await MembershipApplication.countDocuments({ status: 'approved' });
    const loanCount = await LoanApplication.countDocuments({ status: 'approved' });

    res.json({ memberCount, loanCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
