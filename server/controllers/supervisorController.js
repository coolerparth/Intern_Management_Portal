const User = require("../models/User");
const Task = require("../models/Task");
const Report = require("../models/Report");
const Evaluation = require("../models/Evaluation");
const Form = require("../models/Form");

exports.getDashboardData = async (req, res) => {
  try {
    const totalInterns = await User.countDocuments({ role: "intern" });
    const totalTasks = await Task.countDocuments();
    const pendingReports = await Report.countDocuments({ status: "pending" });
    const completedEvaluations = await Evaluation.countDocuments();

    // Re-use logic for leaderboard
    const leaderboardData = await Evaluation.aggregate([
      { $lookup: { from: "reports", localField: "reportId", foreignField: "_id", as: "report" } },
      { $unwind: "$report" },
      { $lookup: { from: "users", localField: "report.internId", foreignField: "_id", as: "intern" } },
      { $unwind: "$intern" },
      { $group: {
          _id: "$intern._id",
          name: { $first: "$intern.name" },
          totalMarks: { $sum: "$marks" },
          averageMarks: { $avg: "$marks" },
          submissions: { $sum: 1 }
      }},
      { $sort: { totalMarks: -1 } }
    ]);

    res.json({
      stats: { totalInterns, totalTasks, pendingReports, completedEvaluations },
      leaderboard: leaderboardData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInterns = async (req, res) => {
  try {
    const interns = await User.find({ role: "intern" }).populate("teamLeadId", "name email");
    res.json(interns);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email");
    res.json(tasks);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("internId", "name email")
      .populate("taskId", "title")
      .sort({ submittedAt: -1 });
    res.json(reports);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.addFeedback = async (req, res) => {
  try {
    const { feedbackBySupervisor } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { feedbackBySupervisor, reviewed: true },
      { new: true }
    );
    res.json({ msg: "Feedback saved", report });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find()
      .populate({ path: "reportId", populate: { path: "internId" } });
    res.json(evaluations);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getForms = async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
