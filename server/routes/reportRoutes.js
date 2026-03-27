const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const { uploadReport, getReports, updateReportStatus, addSupervisorFeedback } = require("../controllers/reportController");

router.post("/", auth, upload.single("file"), uploadReport);
router.get("/", auth, getReports);
router.put("/:id/status", auth, updateReportStatus);
router.put("/:id/feedback", auth, role("supervisor", "admin"), addSupervisorFeedback);

module.exports = router;