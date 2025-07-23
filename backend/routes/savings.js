import express from 'express';
import { getMySavings } from '../controllers/savingsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/mine', protect, getMySavings);

export default router;
