const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { getLeaderboard } = require("../controllers/leaderboardController");

router.get("/", auth, getLeaderboard);

module.exports = router;
