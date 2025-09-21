import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 

  fullName: { type: String, required: true },
  email: String,
  age: Number,
  gender: String,
  maritalStatus: String,

  phone: String,

  address: {
    subCity: String,
    city: String,
    district: String,
  },

  loanAmount: { type: Number, required: true },
  loanDurationMonths: Number,

  monthlyIncome: Number,
  spouseMonthlyIncome: Number,

  loanPurpose: {
    type: String,
    enum: [
      'Medical',
      'Education and Training',
      'Property Purchase and Renovation',
      'Home Purchase or Renovation',
      'Engagement and Marriage',
      'Products and Services',
      'Life Improvement',
      'Graduate Studies',
      'Social Issues',
      'Business Start-up or Expansion',
      'Car Purchase or Renovation',
      'Holidays',
      'Other'
    ]
  },

  witness: {
    fullName: String,
    phone: String,
  },

  guaranteeType: {
    type: String,
    enum: ['Salary Guarantee', 'Car Guarantee', 'Home Guarantee'],
    required: true
  },

  guarantor: {
    fullName: String,
    institution: String,
    jobRole: String,
  },

  documents: [String],

  agreementAccepted: { type: Boolean, required: true },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },

  statusTimeline: {
    type: [
      {
        status: String,
        note: String,
        date: { type: Date, default: Date.now }
      }
    ],
    default: [] 
  },


  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('LoanApplication', loanSchema);
