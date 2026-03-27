const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  formType: String,
  targetRole: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fields: [
    {
      label: String,
      fieldType: { type: String, enum: ["text", "textarea", "dropdown", "radio", "checkbox", "rating"], default: "text" },
      options: [String],
      required: { type: Boolean, default: false }
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("Form", formSchema);