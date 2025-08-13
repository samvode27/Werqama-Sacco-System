import express from 'express';
import { createNews, deleteNews, getNews, updateNews } from '../controllers/newsController.js';
import { upload } from '../middleware/upload.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getNews);
router.post('/', protect, adminOnly, upload.single('image'), createNews);
router.put('/:id', protect, adminOnly, upload.single('image'), updateNews);
router.delete('/:id', protect, adminOnly, deleteNews);

export default router;
