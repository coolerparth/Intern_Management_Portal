const User = require("../models/User");
const Evaluation = require("../models/Evaluation");

exports.getLeaderboard = async (req, res) => {
  try {
    const period = req.query.period || 'all';
    
    // Aggregation pipeline to calculate leaderboard stats
    const leaderboardData = await Evaluation.aggregate([
      {
        $lookup: {
          from: "reports",
          localField: "reportId",
          foreignField: "_id",
          as: "report"
        }
      },
      {
        $unwind: "$report"
      },
      {
        $lookup: {
          from: "users",
          localField: "report.internId",
          foreignField: "_id",
          as: "intern"
        }
      },
      {
        $unwind: "$intern"
      },
      {
        $group: {
          _id: "$intern._id",
          name: { $first: "$intern.name" },
          totalMarks: { $sum: "$marks" },
          averageMarks: { $avg: "$marks" },
          submissions: { $sum: 1 }
        }
      },
      {
        $sort: { totalMarks: -1 }
      }
    ]);

    // Format output and add rank
    let rank = 1;
    let prevScore = null;
    let skip = 0;

    const formattedLeaderboard = leaderboardData.map((intern, index) => {
      if (prevScore !== null && prevScore !== intern.totalMarks) {
        rank += skip;
        skip = 1;
      } else if (prevScore !== null) {
        skip++;
      } else {
         // prevScore is null, first item
         skip = 1;
      }
      prevScore = intern.totalMarks;

      return {
        rank: rank,
        id: intern._id,
        name: intern.name,
        totalMarks: intern.totalMarks,
        averageMarks: Number(intern.averageMarks.toFixed(2)),
        submissions: intern.submissions,
        trend: 0 // Optional positive/negative trend for frontend
      };
    });

    res.json(formattedLeaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
