import express from 'express';
import {
  applyLoan,
  getMyLoans,
  getAllLoans,
  approveLoan,
  rejectLoan,
  getMemberLoanHistory
} from '../controllers/loanApplicationController.js';

import { protect, authorizeRoles, memberOnly } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// File uploads (if needed)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Routes
router.post('/apply', protect, memberOnly, upload.array('documents'), applyLoan);
router.get('/my-loans', protect, memberOnly, getMyLoans);
router.get('/all', protect, authorizeRoles('admin'), getAllLoans);
router.put('/:id/approve', protect, authorizeRoles('admin'), approveLoan);
router.put('/:id/reject', protect, authorizeRoles('admin'), rejectLoan);
router.get('/member/:email', protect, authorizeRoles('admin'), getMemberLoanHistory);

// Serve uploaded documents
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/documents/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.filename);
  res.download(filePath, err => {
    if (err) res.status(404).json({ message: 'File not found' });
  });
});

export default router;
