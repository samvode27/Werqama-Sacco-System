import express from 'express';
import { createNews, deleteNews, getNews, updateNews } from '../controllers/newsController.js';
import { upload } from '../middleware/upload.js';
import { authorizeRoles, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getNews);
// router.post('/', protect, authorizeRoles('admin'), upload.single('image'), createNews);
// router.put('/:id', protect, authorizeRoles('admin'), upload.single('image'), updateNews);
router.post('/', protect, authorizeRoles('admin'), upload.single('newsImage'), createNews);
router.put('/:id', protect, authorizeRoles('admin'), upload.single('newsImage'), updateNews);
router.delete('/:id', protect, authorizeRoles('admin'), deleteNews);

export default router;
