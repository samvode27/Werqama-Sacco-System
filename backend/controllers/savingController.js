import Saving from '../models/Saving.js';
import Loan from "../models/LoanApplication.js";
import asyncHandler from "express-async-handler";
import { Parser } from 'json2csv';

export const getAllSavings = async (req, res) => {
    try {
        const {
            status, memberId, startDate, endDate,
            minAmount, maxAmount, method, search,
            page = 1, limit = 20
        } = req.query;

        let filter = { deleted: false };

        if (status) filter.status = status;
        if (memberId) filter.member = memberId;
        if (method) filter.method = method;
        if (startDate && endDate) filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        if (minAmount || maxAmount) {
            filter.amount = {};
            if (minAmount) filter.amount.$gte = Number(minAmount);
            if (maxAmount) filter.amount.$lte = Number(maxAmount);
        }

        if (search) {
            filter.$or = [
                { 'member.name': { $regex: search, $options: 'i' } },
                { 'member.email': { $regex: search, $options: 'i' } }
            ];
        }

        const savings = await Saving.find(filter)
            .populate('member', 'name email')
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Saving.countDocuments(filter);

        res.json({ total, page: Number(page), limit: Number(limit), savings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteSaving = async (req, res) => {
    try {
        const saving = await Saving.findById(req.params.id);
        if (!saving) return res.status(404).json({ message: 'Saving not found' });

        saving.deleted = true;
        await saving.save();

        res.json({ message: 'Saving deleted successfully', saving });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const approveSaving = async (req, res) => {
    try {
        const saving = await Saving.findById(req.params.id);
        if (!saving) return res.status(404).json({ message: 'Saving not found' });

        saving.status = 'approved';
        saving.adminNotes.push({
            status: 'approved',
            note: req.body.note || 'Approved',
            admin: req.user._id,
        });

        await saving.save();
        res.json({ message: 'Saving approved successfully', saving });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const rejectSaving = async (req, res) => {
    try {
        const saving = await Saving.findById(req.params.id);
        if (!saving) return res.status(404).json({ message: 'Saving not found' });

        saving.status = 'rejected';
        saving.adminNotes.push({
            status: 'rejected',
            note: req.body.note || 'Rejected',
            admin: req.user._id,
        });

        await saving.save();
        res.json({ message: 'Saving rejected successfully', saving });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addManualSaving = async (req, res) => {
    try {
        const { member, amount, method, note } = req.body;
        const saving = new Saving({
            member,
            amount,
            method,
            status: 'approved',
            receipt: req.file?.filename || null,
        });
        if (note) saving.adminNotes.push({ note });
        await saving.save();
        res.status(201).json(saving);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const submitManualSavingByMember = async (req, res) => {
    try {
        const { amount, method, member } = req.body;

        // 🔒 If member, force their own ID (ignore body.member)
        const memberId = req.user.role === 'member'
            ? req.user._id
            : (member || req.user._id); // Admin can pass member in body if needed

        const saving = new Saving({
            member: memberId,
            amount,
            method,
            status: req.user.role === 'admin' ? 'approved' : 'pending',
            receipt: req.file?.filename || null,
        });

        await saving.save();
        res.status(201).json({
            message: req.user.role === 'admin'
                ? 'Saving recorded and auto-approved'
                : 'Manual saving submitted successfully',
            saving
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSavingsByMember = async (req, res) => {
    try {
        const memberId = req.params.id;

        // 🔒 If member, can only view their own savings
        if (req.user.role === 'member' && req.user._id.toString() !== memberId) {
            return res.status(403).json({ message: 'You can only view your own savings' });
        }

        const savings = await Saving.find({ member: memberId }).sort({ date: -1 });
        res.json(savings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getMonthlySavingsByMember = async (req, res) => {
  try {
    const result = await Saving.aggregate([
      { $match: { status: 'approved', deleted: false } },
      {
        $group: {
          _id: {
            member: "$member",
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.member": 1, "_id.year": 1, "_id.month": 1 } }
    ]);

    // Populate member info
    const populated = await Saving.populate(result, { path: "_id.member", select: "name email" });

    const formatted = populated.map(item => ({
      memberId: item._id.member._id,
      memberName: item._id.member.name,
      memberEmail: item._id.member.email,
      month: `${item._id.year}-${String(item._id.month).padStart(2,'0')}`,
      totalAmount: item.totalAmount,
      count: item.count
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Monthly analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch monthly savings analytics', error });
  }
};

export const getMonthlyAnalytics = async (req, res) => {
  try {
    const result = await Saving.aggregate([
      {
        $match: { deleted: false, status: "approved" }
      },
      {
        $group: {
          _id: {
            member: "$member",
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id.member",
          foreignField: "_id",
          as: "memberInfo"
        }
      },
      { $unwind: "$memberInfo" },
      {
        $project: {
          _id: 0,
          memberId: "$memberInfo._id",
          memberName: "$memberInfo.name",
          memberEmail: "$memberInfo.email",
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: [
                  { $lt: ["$_id.month", 10] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" }
                ]
              }
            ]
          },
          totalAmount: 1,
          count: 1
        }
      },
      { $sort: { month: 1, memberName: 1 } }
    ]);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get analytics" });
  }
};

export const getTotalAnalytics = asyncHandler(async (req, res) => {
  try {
    const analytics = await Saving.aggregate([
      {
        $match: { status: "approved", deleted: false },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: [
                  { $lt: ["$_id.month", 10] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" },
                ],
              },
            ],
          },
          totalAmount: 1,
          count: 1,
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ]);

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: "Error fetching total analytics", error });
  }
});

export const formatSavingWithReceipt = (saving, req) => {
    const copy = saving.toObject();
    if (copy.receipt) {
        copy.receiptUrl = `${req.protocol}://${req.get('host')}/uploads/receipts/${copy.receipt}`;
    }
    return copy;
};

export const exportSavingsCsv = async (req, res) => {
  try {
    const { status, memberId, startDate, endDate, method } = req.query;

    let filter = { deleted: false };
    if (status) filter.status = status;
    if (memberId) filter.member = memberId;
    if (method) filter.method = method;
    if (startDate && endDate) filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };

    const savings = await Saving.find(filter)
      .populate('member', 'name email')
      .sort({ date: -1 });

    const data = savings.map(s => ({
      MemberName: s.member.name,
      MemberEmail: s.member.email,
      Amount: s.amount,
      Method: s.method,
      Status: s.status,
      Date: s.date.toISOString().split('T')[0],
      Receipt: s.receipt ? `${req.protocol}://${req.get('host')}/uploads/receipts/${s.receipt}` : ''
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('savings_export.csv');
    return res.send(csv);
  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ message: 'Failed to export savings', error });
  }
};

export const getMemberAnalytics = async (req, res) => {
  try {
    const memberId = req.user._id;

    // --- Savings Stats ---
    const savingTotal = await Saving.aggregate([
      { $match: { member: memberId, status: "approved", deleted: false } },
      {
        $group: {
          _id: "$member",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
          avgAmount: { $avg: "$amount" },
        },
      },
    ]);

    // Monthly trends (savings only)
    const monthly = await Saving.aggregate([
      { $match: { member: memberId, status: "approved", deleted: false } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const formattedMonthly = monthly.map((m) => ({
      month: `${m._id.year}-${String(m._id.month).padStart(2, "0")}`,
      totalAmount: m.totalAmount,
      count: m.count,
    }));

    // Method breakdown (savings only)
    const methodBreakdown = await Saving.aggregate([
      { $match: { member: memberId, status: "approved", deleted: false } },
      {
        $group: {
          _id: "$method",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // --- Loan Total Only ---
    const loanTotal = await Loan.aggregate([
      { $match: { member: memberId, status: "approved" } },
      {
        $group: {
          _id: "$member",
          totalAmount: { $sum: "$loanAmount" },
        },
      },
    ]);

    res.json({
      savings: {
        total: savingTotal[0] || { totalAmount: 0, count: 0, avgAmount: 0 },
        monthly: formattedMonthly,
        methods: methodBreakdown,
      },
      loans: {
        totalAmount: loanTotal.length > 0 ? loanTotal[0].totalAmount : 0,
      },
    });
  } catch (error) {
    console.error("Member analytics error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch member analytics", error });
  }
};


export const getAdminAnalytics = async (req, res) => {
  try {
    // Total system stats
    const overall = await Saving.aggregate([
      { $match: { status: 'approved', deleted: false } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
        },
      },
    ]);

    // Monthly system-wide trends
    const monthly = await Saving.aggregate([
      { $match: { status: 'approved', deleted: false } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const formattedMonthly = monthly.map(m => ({
      month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
      totalAmount: m.totalAmount,
      count: m.count,
    }));

    // Per-member stats
    const perMember = await Saving.aggregate([
      { $match: { status: 'approved', deleted: false } },
      {
        $group: {
          _id: '$member',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
        },
      },
    ]);

    const populated = await Saving.populate(perMember, { path: '_id', select: 'name email' });
    const perMemberFormatted = populated
      .filter(i => i._id)
      .map(i => ({
        memberId: i._id._id,
        memberName: i._id.name,
        memberEmail: i._id.email,
        totalAmount: i.totalAmount,
        count: i.count,
        avgAmount: i.avgAmount,
      }));

    // Payment method distribution
    const methodBreakdown = await Saving.aggregate([
      { $match: { status: 'approved', deleted: false } },
      {
        $group: {
          _id: '$method',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      overall: overall[0] || { totalAmount: 0, count: 0, avgAmount: 0 },
      monthly: formattedMonthly,
      perMember: perMemberFormatted,
      methods: methodBreakdown,
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch admin analytics', error });
  }
};




