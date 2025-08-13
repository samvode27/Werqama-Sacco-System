import asyncHandler from 'express-async-handler';
import MembershipApplication from '../models/MembershipApplication.js';
import User from '../models/User.js';

export const createMembership = async (req, res) => {
  try {
    const existing = await MembershipApplication.findOne({ member: req.user._id, status: 'approved' });
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted a membership application.' });
    }

    // Parse JSON strings into objects
    const beneficiaries = JSON.parse(req.body.beneficiaries);
    const witnesses = JSON.parse(req.body.witnesses);
    const address = JSON.parse(req.body.address);

    const newApp = new MembershipApplication({
      ...req.body,
      member: req.user._id,
      address,
      beneficiaries,
      witnesses,
      idDocument: req.file ? req.file.filename : null,
    });

    const saved = await newApp.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

export const getAllMemberships = async (req, res) => {
  try {
    const apps = await MembershipApplication.find().populate('member', 'name email');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const checkMembership = async (req, res) => {
  try {
    const existing = await MembershipApplication.findOne({ member: req.user._id });

    if (existing) {
      res.json({
        isMember: existing.status === 'approved',
        status: existing.status, // ✅ send status for frontend
        membership: existing
      });
    } else {
      res.json({ isMember: false, status: null, membership: null });
    }

  } catch (err) {
    res.status(500).json({ message: 'Error checking membership status' });
  }
};

export const approveMembership = asyncHandler(async (req, res) => {
  const application = await MembershipApplication.findById(req.params.id);

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  application.status = req.body.status || 'approved'; // Dynamic status support
  application.adminNotes = req.body.adminNotes || ''; // Save admin notes
  await application.save();

  // 👉 Promote the user
  await User.findByIdAndUpdate(application.member, { role: 'member' });

  res.json({ message: 'Membership approved and role updated.' });
});

export const rejectMembership = async (req, res) => {
  try {
    const application = await MembershipApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Membership application not found" });
    }

    application.status = 'rejected';
    await application.save();

    // Optional: demote user if they were member
    await User.findByIdAndUpdate(application.member, { role: 'user' });

    res.json({ message: 'Membership application rejected', application });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting membership', error: err.message });
  }
};


