const Evaluation = require("../models/Evaluation");

// Give marks
exports.addEvaluation = async (req, res) => {
  try {
    const { reportId, marks, feedback } = req.body;

    const evalData = await Evaluation.create({
      reportId,
      marks,
      feedback
    });

    res.json({ msg: "Evaluation done", evalData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Extra feature :: Leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Evaluation.find()
      .sort({ marks: -1 })
      .populate({
        path: "reportId",
        populate: { path: "internId" }
      });

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};