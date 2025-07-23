import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 1000,
    },
    purpose: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    repaymentStatus: {
        type: String,
        enum: ['ongoing', 'completed'],
        default: 'ongoing',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Loan', loanSchema);
