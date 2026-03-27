const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional if public
  answers: { type: mongoose.Schema.Types.Mixed }, // { fieldId: value } or { fieldLabel: value }
}, { timestamps: true });

module.exports = mongoose.model("FormResponse", responseSchema);
