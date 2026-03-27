const Task = require("../models/Task");

// Team Lead assigns task
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, deadline } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user.id,
      deadline
    });

    res.json({ msg: "Task assigned", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Intern sees their tasks
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update task status
exports.updateTask = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Team lead sees tasks they assigned
exports.getTeamLeadTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedBy: req.user.id }).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};