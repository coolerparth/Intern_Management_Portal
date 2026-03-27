const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deadline: Date,
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);