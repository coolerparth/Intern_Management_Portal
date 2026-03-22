const mongoose = require("mongoose");

const internSchema = new mongoose.Schema({
  name: String,
  email: String,
  teamLeadId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  department: String,
  joiningDate: Date
});

module.exports = mongoose.model("Intern", internSchema);