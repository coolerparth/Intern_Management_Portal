const router = require("express").Router();
const { register, login, createSupervisor } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/create-supervisor", auth, role("admin"), createSupervisor);

module.exports = router;