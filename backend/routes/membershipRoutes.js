// routes/membershipRoutes.js
import express from 'express';
import { approveMembership, checkMembership, createMembership, deleteMember, getAllMemberships, getApprovedMembers, getPendingMemberships, rejectMembership, updateMember } from '../controllers/membershipController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, upload.single('idDocument'), authorizeRoles('user'),createMembership);
router.get('/', protect, authorizeRoles('admin'), getAllMemberships);
router.get('/check', protect, authorizeRoles('member', 'user'), checkMembership);
router.put('/approve/:id', protect, authorizeRoles('admin'), approveMembership); 
router.put('/reject/:id', protect, authorizeRoles('admin'), rejectMembership);

router.get('/approved', protect, authorizeRoles('admin'), getApprovedMembers); 
router.get('/pending', protect, authorizeRoles('admin'), getPendingMemberships);
router.put('/:id', upload.single('idDocument'), protect, authorizeRoles('admin'), updateMember);
router.delete('/:id', protect, authorizeRoles('admin'), deleteMember); 

export default router;