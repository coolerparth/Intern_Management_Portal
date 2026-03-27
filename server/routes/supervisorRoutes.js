const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { 
  getDashboardData, 
  getInterns, 
  getTasks, 
  getReports, 
  addFeedback, 
  getEvaluations, 
  getForms 
} = require("../controllers/supervisorController");

// Restrict all to supervisor or admin
router.use(auth, role("supervisor", "admin"));

router.get("/dashboard", getDashboardData);
router.get("/interns", getInterns);
router.get("/tasks", getTasks);
router.get("/reports", getReports);
router.put("/report/feedback/:id", addFeedback);
router.get("/evaluations", getEvaluations);
router.get("/forms", getForms);

module.exports = router;
