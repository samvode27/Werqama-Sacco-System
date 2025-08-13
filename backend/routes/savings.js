import express from 'express';
import multer from 'multer';
import {
  addManualSaving,
  approveSaving,
  getAllSavings,
  getMonthlySavingsAnalytics,
  getSavingsByMember,
  getTotalStatistics,
  rejectSaving,
  submitManualSavingByMember
} from '../controllers/savingController.js';
import { protect, adminOnly, memberOnly } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/receipts' });

// ✅ Specific member routes first (accessible to members)
router.get('/member/:id', protect, memberOnly, getSavingsByMember);
router.post('/member/manual', protect, memberOnly, upload.single('receipt'), submitManualSavingByMember);

// ✅ Admin-only routes follow
router.post('/manual', protect, adminOnly, upload.single('receipt'), addManualSaving);
router.put('/:id/approve', protect, adminOnly, approveSaving);
router.put('/:id/reject', protect, adminOnly, rejectSaving);
router.get('/analytics/monthly', protect, adminOnly, getMonthlySavingsAnalytics);
router.get('/analytics/summary', protect, adminOnly, getTotalStatistics);
router.get('/', protect, adminOnly, getAllSavings); // ❗ keep this at the end

export default router;
