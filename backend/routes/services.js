import express from 'express';
import { createService, getServices } from '../controllers/serviceController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getServices);
router.post('/', protect, authorizeRoles('admin'), createService);

export default router;
