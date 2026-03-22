const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const { addEvaluation, getLeaderboard } = require("../controllers/evaluationController");
router.get("/leaderboard", auth, getLeaderboard);
router.post("/", auth, role("teamlead"), addEvaluation);

module.exports = router;