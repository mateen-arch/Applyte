const { Resume } = require("../../models/resume");
const { User } = require("../../models/user");
const { extractJsonStringAdvanced } = require("../../utils/extractJsonHelper");
const { resumeAnalyzerHelper } = require("../AI/functionality");

const ResumeAnalyzer = async (req, res) => {
  try {
    // Validate file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume file provided!",
      });
    }

    const userID = req._id; // Fixed: use req._id from auth middleware
    const resume = req.file;

    // Validate user exists
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Analyze resume using AI
    const response = await resumeAnalyzerHelper(resume);

    if (!response) {
      return res.status(400).json({
        success: false,
        message: "Failed to extract resume information!",
      });
    }

    // Parse the AI response
    const cleanJSON = extractJsonStringAdvanced(response);
    const result = await JSON.parse(cleanJSON);

    // Create resume document
    const resumeObj = await Resume.create({
      user: userID,
      originalFileName: resume.originalname || "resume.pdf",
      ...result
    });

    // Link resume to user
    if (!user.resume) {
      user.resume = [];
    }
    user.resume.push(resumeObj._id);
    await user.save();

    console.log("Resume created and linked to user:", resumeObj._id);

    return res.status(200).json({
      success: true,
      message: "Resume successfully analyzed!",
      resumeId: resumeObj._id,
    });
  } catch (err) {
    console.error("Error in Resume Analyzer:", err);
    console.error("Error stack:", err.stack);
    return res.status(500).json({
      success: false,
      message: "Failed to analyze resume!",
    });
  }
};

module.exports = { ResumeAnalyzer };
