const router = require("express").Router();
const Member = require("../models/Member");
const verify = require("../middleware/authMiddleware");

router.post("/", async (req, res) => {
  try {
    const newMember = new Member(req.body);
    const saved = await newMember.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/", verify, async (req, res) => {
  const members = await Member.find();
  res.json(members);
});

module.exports = router;
