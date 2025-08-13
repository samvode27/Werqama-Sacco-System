import Loan from '../models/Loan.js';
import sendLoanStatusEmail from '../utils/sendLoanStatusEmail.js';

export const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate('member', 'name fullName email')
      .sort({ createdAt: -1 });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLoanStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const loan = await Loan.findById(req.params.id);

    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    // Push to status timeline
    loan.statusTimeline.push({ status });

    // Push to admin notes — must be an object!
    if (note && typeof note === 'string' && note.trim()) {
      loan.adminNotes.push({ note: note.trim(), date: new Date() });
    }

    loan.status = status;
    await loan.save();

    res.json({ message: `Loan ${status} successfully` });
  } catch (error) {
    console.error("Loan update error:", error);
    res.status(500).json({ message: "Loan status update failed", error });
  }
};

export const approveLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    loan.status = 'approved';
    loan.statusTimeline.push({ status: 'approved', timestamp: new Date() });
    await loan.save();

    // Optionally send email
    await sendLoanStatusEmail(loan.userEmail, 'approved');

    res.json({ message: 'Loan approved successfully', loan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const rejectLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    loan.status = 'rejected';
    loan.statusTimeline.push({ status: 'rejected', timestamp: new Date() });
    await loan.save();

    await sendLoanStatusEmail(loan.userEmail, 'rejected');

    res.json({ message: 'Loan rejected successfully', loan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMemberLoanHistory = async (req, res) => {
  try {
    const loans = await Loan.find({ memberId: req.params.id });
    if (!loans) {
      return res.status(404).json({ message: 'No loans found for this member.' });
    }
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




