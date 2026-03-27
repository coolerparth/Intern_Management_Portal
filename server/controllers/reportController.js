const Report = require("../models/Report");
const Intern = require("../models/Intern");

// Upload report
exports.uploadReport = async (req, res) => {
  try {
    const report = await Report.create({
      internId: req.user.id,
      taskId: req.body.taskId,
      title: req.body.title || "Progress Report",
      filePath: req.file ? req.file.path : null
    });

    res.json({ msg: "Report uploaded", report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get reports (teamlead view - only their interns' reports)
exports.getReports = async (req, res) => {
  try {
    let reports;
    if (req.user.role === "teamlead") {
      const interns = await require("../models/User").find({ teamLeadId: req.user.id, role: "intern" }).select("_id");
      const internIds = interns.map(i => i._id);
      reports = await Report.find({ internId: { $in: internIds } })
        .populate("internId", "name email")
        .populate("taskId", "title")
        .sort({ submittedAt: -1 });
    } else if (req.user.role === "admin" || req.user.role === "supervisor") {
      reports = await Report.find()
        .populate("internId", "name email")
        .populate("taskId", "title")
        .sort({ submittedAt: -1 });
    } else {
      // Intern sees only their own
      reports = await Report.find({ internId: req.user.id })
        .populate("taskId", "title")
        .sort({ submittedAt: -1 });
    }
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update report status (approve / reject)
exports.updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!report) return res.status(404).json({ msg: "Report not found" });
    res.json({ msg: "Status updated", report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Supervisor Feedback
exports.addSupervisorFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { feedbackBySupervisor: feedback, reviewed: true },
      { new: true }
    );
    if (!report) return res.status(404).json({ msg: "Report not found" });
    res.json({ msg: "Feedback added", report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};