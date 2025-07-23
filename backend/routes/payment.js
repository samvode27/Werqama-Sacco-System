import express from 'express';
import { initializeChapaPayment, chapaWebhook } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/chapa/init', protect, initializeChapaPayment);
router.post('/chapa/webhook', chapaWebhook);

export default router;
