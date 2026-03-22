const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
  marks: Number,
  feedback: String
});

module.exports = mongoose.model("Evaluation", evaluationSchema);