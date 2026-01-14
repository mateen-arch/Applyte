const express = require("express");
const { isAuthorized } = require("../middlewares/auth");
const {
  generateQuestions,
  generateExplanation,
} = require("../controllers/InterviewPrep/ai_controller");
const { analyzeSkillGap } = require("../controllers/SkillGap/skillGapController");

const router = express.Router();

router.post("/generate-questions", isAuthorized, generateQuestions);
router.post("/generate-explanation", isAuthorized, generateExplanation);
router.post("/analyze-skill-gap", isAuthorized, analyzeSkillGap);

module.exports = router;
