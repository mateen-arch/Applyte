const express = require("express");
const { isAuthorized } = require("../middlewares/auth");
const {
  generateQuestions,
  generateExplanation,
} = require("../controllers/InterviewPrep/ai_controller");

const router = express.Router();

router.post("/generate-questions", isAuthorized, generateQuestions);
router.post("/generate-explanation", isAuthorized, generateExplanation);

module.exports = router;
