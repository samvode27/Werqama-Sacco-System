import express from 'express';
import { uploadFile } from '../controllers/uploadController.js';
import { upload } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, upload.single('file'), uploadFile);


export default router;
