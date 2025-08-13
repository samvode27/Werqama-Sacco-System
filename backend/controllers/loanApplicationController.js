import LoanApplication from '../models/LoanApplication.js';
import { sendEmail } from '../utils/emailSender.js';
import sendLoanStatusEmail from '../utils/sendLoanStatusEmail.js';

export const applyLoan = async (req, res) => {
  try {
    const {
      fullName,
      email,
      age,
      gender,
      maritalStatus,
      address,
      phone,
      loanAmount,
      loanDurationMonths,
      monthlyIncome,
      spouseIncome,
      loanPurpose,
      associationWitness,
      guarantees,
      guarantorFullName,
      guarantorInstitution,
      guarantorJobRole,
      agreementAccepted
    } = req.body;

    if (!loanAmount || !loanPurpose) {
      return res.status(400).json({ message: 'Amount and purpose are required.' });
    }

    const loan = await LoanApplication.create({
      member: req.user._id,
      fullName,
      email,
      age,
      gender,
      maritalStatus,
      address,
      phone,
      loanAmount,
      loanDurationMonths, // ✅ matches schema
      monthlyIncome,
      spouseMonthlyIncome: spouseIncome, // ✅ matches schema
      loanPurpose,
      witness: associationWitness, // ✅ matches schema
      guaranteeType: guarantees, // ✅ matches schema
      guarantor: {
        fullName: guarantorFullName,
        institution: guarantorInstitution,
        jobRole: guarantorJobRole
      },
      agreementAccepted,
      documents: req.files?.map(f => f.filename) || [],
      statusTimeline: [{ status: 'pending', note: 'Submitted by user' }]
    });

    await sendEmail(email, 'Loan Received', `<p>Dear ${fullName}, your application is received.</p>`);
    res.status(201).json({ message: 'Loan submitted', loan });

  } catch (err) {
    console.error('Loan apply failed:', err);
    res.status(400).json({ message: 'Loan application failed', error: err.message });
  }
};

// Get my loans
export const getMyLoans = async (req, res) => {
  try {
    const loans = await LoanApplication.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all loans (admin)
export const getAllLoans = async (req, res) => {
  try {
    const loans = await LoanApplication.find()
    .populate('member', 'name email fullName')
    .sort({ createdAt: -1 });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve loan
export const approveLoan = async (req, res) => {
  try {
    const loan = await LoanApplication.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    loan.status = 'approved';
    loan.statusTimeline.push({ status: 'approved', note: req.body.note || 'Approved by admin' });
    await loan.save();

    await sendLoanStatusEmail(loan.email, 'approved');
    res.json({ message: 'Loan approved successfully', loan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject loan
export const rejectLoan = async (req, res) => {
  try {
    const loan = await LoanApplication.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    loan.status = 'rejected';
    loan.statusTimeline.push({ status: 'rejected', note: req.body.note || 'Rejected by admin' });
    await loan.save();

    await sendLoanStatusEmail(loan.email, 'rejected');
    res.json({ message: 'Loan rejected successfully', loan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Member loan history (admin)
export const getMemberLoanHistory = async (req, res) => {
  try {
    const loans = await LoanApplication.find({ email: req.params.email });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
