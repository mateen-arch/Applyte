const express = require("express");
const { ResumeAnalyzer } = require("../controllers/Resume/resumeAnalyzer");
const { uploadResume, handleMulterError } = require("../middlewares/multer");
const { isAuthorized } = require("../middlewares/auth");
const { getResume } = require("../controllers/Resume/resumeUtils");
const { getResumeSuggestions, updateResumeWithSuggestion, updateResume } = require("../controllers/Resume/resumeCustomization");
const router = express.Router();

router.post("/analyze-resume", isAuthorized, uploadResume, handleMulterError, ResumeAnalyzer);
router.get("/get-resume", isAuthorized, getResume);
router.get("/suggestions", isAuthorized, getResumeSuggestions);
router.post("/apply-suggestion", isAuthorized, updateResumeWithSuggestion);
router.put("/update", isAuthorized, updateResume);

module.exports = router;
