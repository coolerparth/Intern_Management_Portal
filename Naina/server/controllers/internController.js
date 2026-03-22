const User = require("../models/User");

// Team Lead creates intern
exports.createIntern = async (req, res) => {
  try {
    const { name, email, password, teamLeadId } = req.body;

    // Use teamLeadId from body, fallback to authenticated user's ID
    const tlId = teamLeadId || (req.user ? req.user.id || req.user._id : null);

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Intern already exists" });
    }

    const bcrypt = require("bcryptjs");
    const hashed = await bcrypt.hash(password || 'default123', 10);

    const intern = await User.create({
      name,
      email,
      password: hashed,
      role: "intern",
      teamLeadId: tlId
    });

    res.json({ msg: "Intern created", intern });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all interns
exports.getInterns = async (req, res) => {
  try {
    const interns = await User.find({ role: "intern" });
    res.json(interns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};