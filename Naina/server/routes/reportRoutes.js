const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const { uploadReport, getReports } = require("../controllers/reportController");
router.post("/", auth, upload.single("file"), uploadReport);

router.get("/", auth, getReports);

module.exports = router;