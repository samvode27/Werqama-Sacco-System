// routes/savingRoutes.js
import express from 'express';
import {
  addManualSaving,
  approveSaving,
  rejectSaving,
  getAllSavings,
  getSavingsByMember,
  submitManualSavingByMember,
  deleteSaving,
  exportSavingsCsv,
  getMonthlyAnalytics,
  getTotalAnalytics,
  getMemberAnalytics,
  getAdminAnalytics,
} from '../controllers/savingController.js';

import { protect, authorizeRoles } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js'; // ✅ Use your custom multer

const router = express.Router();

// ==========================
// Member / Admin Routes
// ==========================

// Submit a manual saving (member or admin)
router.post(
  '/submit',
  protect,
  authorizeRoles('member', 'admin'),
  upload.single('receipt'), // ✅ use custom storage
  submitManualSavingByMember
);

// View own savings (member) or any member (admin)
router.get(
  '/member/:id',
  protect,
  authorizeRoles('member', 'admin'),
  getSavingsByMember
);

// ==========================
// Admin-Only Routes
// ==========================

// Add a manual saving (admin)
router.post(
  '/manual',
  protect,
  authorizeRoles('admin'),
  upload.single('receipt'), // ✅ use custom storage
  addManualSaving
);

// Approve or reject a saving
router.put('/:id/approve', protect, authorizeRoles('admin'), approveSaving);
router.put('/:id/reject', protect, authorizeRoles('admin'), rejectSaving);

// View all savings
router.get('/', protect, authorizeRoles('admin'), getAllSavings);

// Analytics
router.get('/analytics/monthly', protect, authorizeRoles('admin'), getMonthlyAnalytics);
router.get('/analytics/summary', protect, authorizeRoles('admin'), getTotalAnalytics);

// Delete a saving
router.delete('/:id', protect, authorizeRoles('admin'), deleteSaving);

// Export CSV
router.get('/export/csv', protect, authorizeRoles('admin'), exportSavingsCsv);

// Member analytics
router.get('/analytics/member', protect, authorizeRoles('member'), getMemberAnalytics);

// Admin analytics
router.get('/analytics/admin', protect, authorizeRoles('admin'), getAdminAnalytics);

export default router;
