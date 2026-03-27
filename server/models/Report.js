const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  internId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  title: { type: String, default: "Progress Report" },
  filePath: String,
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  feedbackBySupervisor: { type: String, default: "" },
  reviewed: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);