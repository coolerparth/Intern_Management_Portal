const router = require("express").Router();
const { createForm } = require("../controllers/formController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, createForm);

module.exports = router;