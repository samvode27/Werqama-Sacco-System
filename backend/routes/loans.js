import express from 'express';
import {
    approveLoan,
    getAllLoans,
    getMemberLoanHistory,
    getMyLoans,
    rejectLoan,
    updateLoanStatus
} from '../controllers/loanController.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { protect, adminOnly } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.get('/my-loans', protect, getMyLoans);
router.get('/all', protect, adminOnly, getAllLoans);
router.put('/approve/:id', protect, adminOnly, approveLoan);
router.put('/reject/:id', protect, adminOnly, rejectLoan);
router.put('/:id/status', updateLoanStatus);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve loan documents by filename
router.get('/documents/:filename', (req, res) => {
    const filePath = path.join(__dirname, '../uploads', req.params.filename);
    res.download(filePath, err => {
        if (err) {
            console.error('Download error:', err);
            res.status(404).json({ message: 'File not found' });
        }
    });
});

// Fetch full member loan + repayment history
router.get('/member-history/:id', getMemberLoanHistory);


export default router;
