const Form = require("../models/Form");
const FormResponse = require("../models/FormResponse");

exports.createForm = async (req, res) => {
  try {
    const { title, description, formType, targetRole, fields } = req.body;
    const form = await Form.create({
      title,
      description,
      formType,
      targetRole,
      fields,
      createdBy: req.user._id || req.user.id
    });
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getForms = async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    
    // Aggregate responses count
    const formsWithCounts = await Promise.all(forms.map(async (form) => {
      const count = await FormResponse.countDocuments({ formId: form._id });
      return { ...form.toObject(), submissions: count };
    }));

    res.json(formsWithCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ msg: "Form not found" });
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateForm = async (req, res) => {
  try {
    const { title, description, formType, targetRole, fields } = req.body;
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      { title, description, formType, targetRole, fields },
      { new: true }
    );
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteForm = async (req, res) => {
  try {
    await Form.findByIdAndDelete(req.params.id);
    await FormResponse.deleteMany({ formId: req.params.id }); // Clean up responses
    res.json({ msg: "Form deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUBLIC access to form (No Auth needed)
exports.getPublicForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ msg: "Form not found" });
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUBLIC response submission
exports.submitForm = async (req, res) => {
  try {
    const formId = req.params.id;
    const { answers, userId } = req.body; // userId optional if no auth passed

    const response = await FormResponse.create({
      formId,
      userId: userId || null,
      answers
    });

    res.json({ msg: "Response submitted successfully", response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFormResponses = async (req, res) => {
  try {
    const responses = await FormResponse.find({ formId: req.params.id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};