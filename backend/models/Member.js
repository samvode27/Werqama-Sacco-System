import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  phone: String,
  address: String,
  membershipId: String,
  registeredAt: { type: Date, default: Date.now }
});

const Member = mongoose.model("Member", MemberSchema);
export default Member;
