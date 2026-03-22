const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  createIntern,
  getInterns
} = require("../controllers/internController");

// Only teamlead can create intern
router.post("/create", auth, role("teamlead"), createIntern);

// Anyone logged in can view interns
router.get("/", auth, getInterns);

module.exports = router;