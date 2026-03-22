const Form = require("../models/Form");

exports.createForm = async (req, res) => {
  const form = await Form.create(req.body);
  res.json(form);
};