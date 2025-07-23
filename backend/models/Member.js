const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  phone: String,
  address: String,
  membershipId: String,
  registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Member", MemberSchema);
