import express from 'express';
import { loginUser, getMe, forgotPassword, resetPassword, register, verifyOtp, resendOtp, initiateFaydaAuth, verifyFaydaAuth } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post("/verify-otp", verifyOtp); 
router.post("/resend-otp", resendOtp);
router.post('/login', loginUser);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/me', protect, getMe);

router.post('/fayda/initiate', initiateFaydaAuth);
router.post('/fayda/verify', verifyFaydaAuth);

export default router;
