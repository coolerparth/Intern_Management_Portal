const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  title: String,
  questions: [String],
  responses: Array
});

module.exports = mongoose.model("Form", formSchema);