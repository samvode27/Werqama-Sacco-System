import express from 'express';
import {
    getProfile,
    updateProfile,
    changePassword,
    uploadProfilePicture
} from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';
import { uploadProfilePic } from '../middleware/uploadProfilePic.js';

const router = express.Router();

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/picture', protect, uploadProfilePic.single('profilePicture'), uploadProfilePicture);

export default router;
