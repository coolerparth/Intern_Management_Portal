const Report = require("../models/Report");

// Upload report
exports.uploadReport = async (req, res) => {
  try {
    const report = await Report.create({
      internId: req.user.id,
      taskId: req.body.taskId,
      filePath: req.file.path
    });

    res.json({ msg: "Report uploaded", report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get reports (teamlead view)
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("internId taskId");
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};