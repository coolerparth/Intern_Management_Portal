const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  internId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  filePath: String,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", reportSchema);