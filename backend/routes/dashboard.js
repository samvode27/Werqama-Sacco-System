import express from 'express';
import { getAdminDashboardStats, getMemberDashboardStats } from '../controllers/dashboardController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin', protect, authorizeRoles('admin'), getAdminDashboardStats);
router.get('/member', protect, getMemberDashboardStats);

export default router;
