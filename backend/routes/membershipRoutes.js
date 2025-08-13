// routes/membershipRoutes.js
import express from 'express';
import { approveMembership, checkMembership, createMembership, getAllMemberships, rejectMembership } from '../controllers/membershipController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, upload.single('idDocument'), createMembership);
router.get('/', protect, adminOnly, getAllMemberships);
router.get('/check', protect, checkMembership);
router.put('/approve/:id', protect, adminOnly, approveMembership); 
router.put('/reject/:id', protect, adminOnly, rejectMembership);

export default router;