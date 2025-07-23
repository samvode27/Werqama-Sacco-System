import express from 'express';
import { createNews, getNews } from '../controllers/newsController.js';
import { upload } from '../middleware/upload.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getNews);
router.post('/', protect, adminOnly, upload.single('image'), createNews);

export default router;
