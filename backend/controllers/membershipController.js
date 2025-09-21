import asyncHandler from 'express-async-handler';
import MembershipApplication from '../models/MembershipApplication.js';
import User from '../models/User.js';

export const createMembership = async (req, res) => {
  try {
    const existing = await MembershipApplication.findOne({
      member: req.user._id,
      status: 'approved',
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: 'You already have an approved membership.' });
    }

    const {
      fullName,
      email,
      age,
      gender,
      maritalStatus,
      educationLevel,
      occupation,
      phone,
      address,
      sourceOfInformation,
      beneficiaries,
      witnesses,
      agreementAccepted,
    } = req.body;

    const newApp = new MembershipApplication({
      member: req.user._id,
      fullName,
      email,
      age,
      gender,
      maritalStatus,
      educationLevel,
      occupation,
      phone,
      address: JSON.parse(address),
      sourceOfInformation,
      beneficiaries: JSON.parse(beneficiaries),
      witnesses: JSON.parse(witnesses),
      agreementAccepted: agreementAccepted === 'true',
      idDocument: req.file ? req.file.filename : null,
      status: 'pending',
    });

    const savedApp = await newApp.save();

    // Update user role to 'member' immediately
    await User.findByIdAndUpdate(req.user._id, { role: 'member' });

    res.status(201).json(savedApp);
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

export const getApprovedMembers = asyncHandler(async (req, res) => {
  const members = await MembershipApplication.find({ status: 'approved' })
    .populate('member', 'name email role');
  res.json(members);
});

export const getPendingMemberships = asyncHandler(async (req, res) => {
  const pendingApplications = await MembershipApplication.find({ status: 'pending' })
    .populate('member', 'name email role')
    .sort({ submittedAt: -1 }); // optional: newest first

  res.json(pendingApplications);
});

export const updateMember = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const membership = await MembershipApplication.findById(id);
  if (!membership) return res.status(404).json({ message: 'Member not found' });

  const fields = [
    'fullName', 'email', 'phone', 'age', 'gender', 'maritalStatus',
    'educationLevel', 'occupation', 'address', 'sourceOfInformation',
    'beneficiaries', 'witnesses', 'agreementAccepted'
  ];

  fields.forEach(f => {
    if (req.body[f] !== undefined) {
      if (['beneficiaries', 'witnesses', 'address'].includes(f)) {
        if (typeof req.body[f] === 'string' && req.body[f].trim() !== '') {
          try {
            membership[f] = JSON.parse(req.body[f]);
          } catch (err) {
            console.error(`Failed to parse field ${f}:`, err);
            membership[f] = [];
          }
        } else if (Array.isArray(req.body[f]) || typeof req.body[f] === 'object') {
          membership[f] = req.body[f];
        } else {
          membership[f] = [];
        }
      } else if (f === 'agreementAccepted') {
        membership[f] = req.body[f] === 'true';
      } else {
        membership[f] = req.body[f];
      }
    }
  });

  // Update ID Document if uploaded
  if (req.file) {
    membership.idDocument = req.file.filename; // multer saves in idDocuments folder
  }

  await membership.save();

  // Update linked user fields if necessary
  const userFields = ['name', 'email', 'phone'];
  const userData = {};
  userFields.forEach(f => { if (req.body[f] !== undefined) userData[f] = req.body[f] });
  if (Object.keys(userData).length > 0) {
    await User.findByIdAndUpdate(membership.member, userData, { new: true });
  }

  res.json({ message: 'Member updated successfully', membership });
});


export const deleteMember = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Delete membership applications
  await MembershipApplication.deleteMany({ member: id });
  // Delete user
  await User.findByIdAndDelete(id);

  res.json({ message: 'Member deleted successfully' });
});




