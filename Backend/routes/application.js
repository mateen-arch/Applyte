const express = require("express");
const { isAuthorized } = require("../middlewares/auth");
const {
  createApplication,
  getAllApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  getApplicationAnalytics,
  generateFollowUp,
} = require("../controllers/Application/applicationController");

const router = express.Router();

// Application CRUD routes
router.post("/", isAuthorized, createApplication);
router.get("/", isAuthorized, getAllApplications);
router.get("/:id", isAuthorized, getApplication);
router.put("/:id", isAuthorized, updateApplication);
router.delete("/:id", isAuthorized, deleteApplication);

// Analytics and AI routes
router.get("/analytics/overview", isAuthorized, getApplicationAnalytics);
router.post("/follow-up/generate", isAuthorized, generateFollowUp);

module.exports = router;
