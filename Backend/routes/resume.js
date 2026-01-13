const express = require("express");
const { ResumeAnalyzer } = require("../controllers/Resume/resumeAnalyzer");
const { uploadFile } = require("../middlewares/multer");
const { isAuthorized } = require("../middlewares/auth");
const { getResume } = require("../controllers/Resume/resumeUtils");
const router = express.Router();

router.post("/analyze-resume", isAuthorized, uploadFile, ResumeAnalyzer);
router.get("/get-resume", isAuthorized, getResume);

module.exports = router;
