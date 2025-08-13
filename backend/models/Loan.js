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
  },
  purpose: {
    type: String,
    required: true,
  },
  loanType: {
    type: String,
    default: 'personal',
  },
  duration: {
    type: String,
    default: 6,
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
  statusTimeline: [
    {
      status: String,
      date: { type: Date, default: Date.now },
    },
  ],
  adminNotes: [
    {
      note: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  documents: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Loan', loanSchema);
