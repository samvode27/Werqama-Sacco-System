import Loan from '../models/Loan.js';

export const applyLoan = async (req, res) => {
    try {
        const { amount, purpose } = req.body;
        const loan = await Loan.create({
            member: req.user._id,
            amount,
            purpose,
            status: 'pending',
        });
        res.status(201).json(loan);

        await sendEmail(
    req.user.email,
    'Loan Application Received',
    `<p>Dear ${req.user.name},</p>
    <p>We have received your loan application for ETB ${amount} for the purpose of "${purpose}". Our team will review and get back to you shortly.</p>
    <p>Thank you for using WERQAMA SACCO.</p>`
);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ member: req.user._id }).sort({ createdAt: -1 });
        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find().populate('member', 'name email').sort({ createdAt: -1 });
        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateLoanStatus = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        loan.status = req.body.status || loan.status;
        loan.repaymentStatus = req.body.repaymentStatus || loan.repaymentStatus;
        await loan.save();
        res.json(loan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
