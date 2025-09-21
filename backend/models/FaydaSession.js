// backend/models/FaydaSession.js
import mongoose from 'mongoose';

const faydaSessionSchema = mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  faydaNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
});

const FaydaSession = mongoose.model('FaydaSession', faydaSessionSchema);
export default FaydaSession;
