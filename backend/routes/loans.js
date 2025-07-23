import express from 'express';
import {
    applyLoan,
    getAllLoans,
    getMyLoans,
    updateLoanStatus
} from '../controllers/loanController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/apply', protect, applyLoan);
router.get('/all', protect, adminOnly, getAllLoans);
router.get('/my-loans', protect, getMyLoans);
router.patch('/:id/status', protect, adminOnly, updateLoanStatus);

export default router;
