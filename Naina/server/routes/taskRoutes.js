const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  createTask,
  getMyTasks,
  updateTask
} = require("../controllers/taskController");

// Only teamlead can assign
router.post("/create", auth, role("teamlead"), createTask);

// Intern dashboard
router.get("/my", auth, role("intern"), getMyTasks);

// Update task (intern updates status)
router.put("/:id", auth, updateTask);

module.exports = router;