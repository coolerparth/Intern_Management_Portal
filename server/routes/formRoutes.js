const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { 
  createForm, 
  getForms, 
  getFormById, 
  updateForm, 
  deleteForm, 
  getPublicForm, 
  submitForm, 
  getFormResponses 
} = require("../controllers/formController");

// PUBLIC ROUTES
router.get("/public/:id", getPublicForm);
router.post("/submit/:id", submitForm); // Changed from auth required to public, optionally track user if auth passed

// AUTH ROUTES
router.post("/create", auth, createForm); // Or generic POST / (kept /create for explicit intention)
router.post("/", auth, createForm);
router.get("/", auth, getForms);
router.get("/:id", auth, getFormById);
router.put("/:id", auth, updateForm);
router.delete("/:id", auth, deleteForm);
router.get("/:id/responses", auth, getFormResponses);

module.exports = router;