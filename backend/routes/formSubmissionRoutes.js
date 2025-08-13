import express from 'express';
import { protect } from '../middleware/auth.js';
import FormSubmission from '../models/FormSubmission.js';

const router = express.Router();

// POST /api/form-submissions
router.post('/', protect, async (req, res) => {
  const { type, data } = req.body;

  if (!type || !data) {
    return res.status(400).json({ message: 'Form type and data are required' });
  }

  const submission = new FormSubmission({
    member: req.user._id,
    type,
    data,
  });

  await submission.save();

  res.status(201).json({ message: 'Form submitted successfully' });
});

// GET /api/form-submissions (for admin only - optional)
router.get('/', protect, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admins only' });
  }

  const submissions = await FormSubmission.find().populate('member', 'name email');
  res.json(submissions);
});

export default router;
