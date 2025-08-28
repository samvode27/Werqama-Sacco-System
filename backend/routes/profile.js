import express from 'express';
import multer from 'multer';
import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  removeProfilePicture,
  changePassword,
} from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js'; // your JWT auth middleware

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/profilePictures');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.post('/picture', protect, upload.single('profilePicture'), uploadProfilePicture);
router.delete('/picture', protect, removeProfilePicture);
router.put('/password', protect, changePassword);

export default router;
