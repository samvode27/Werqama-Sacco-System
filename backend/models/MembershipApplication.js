  import mongoose from 'mongoose';

  const personSchema = new mongoose.Schema({
    fullName: String,
    subCity: String,
    city: String,
    district: String,
  }, { _id: false });

  const membershipSchema = new mongoose.Schema({
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional
    fullName: { type: String, required: true },
    email: String,
    age: Number,
    gender: String,
    maritalStatus: String,
    educationLevel: String,
    occupation: String,
    phone: String,

    address: {
      subCity: String,
      city: String,
      district: String,
    },

    sourceOfInformation: String,

    idDocument: String,

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'unknown'],
      default: 'pending'
    },

    beneficiaries: {
      type: [personSchema],
      validate: v => v.length >= 1 && v.length <= 3
    },

    witnesses: {
      type: [personSchema],
      validate: v => v.length >= 1 && v.length <= 3
    },

    agreementAccepted: { type: Boolean, required: true },
    
    submittedAt: { type: Date, default: Date.now },
  });

  export default mongoose.model('MembershipApplication', membershipSchema);
