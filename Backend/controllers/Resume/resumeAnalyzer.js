const { Resume } = require("../../models/resume");
const { extractJsonStringAdvanced } = require("../../utils/extractJsonHelper");
const { resumeAnalyzerHelper } = require("../AI/functionality");


const ResumeAnalyzer = async (req, res) => {
  try {
    const id = req.id;
    const resume = req.file;

    const response = await resumeAnalyzerHelper(resume);

    if (!response) {
      return res.status(400).json({
        success: false,
        message: "Failed to extract Info!",
      });
    }

    const cleanJSON = extractJsonStringAdvanced(response);
    const result = await JSON.parse(cleanJSON);
    const resumeObj = await Resume.create({
      originalFileName: "resume.pdf",
      ...result
    })

    console.log(resumeObj);

    return res.status(200).json({
      success: true,
      message: "Resume successfully analyzed!",
    });
  } catch (err) {
    console.log("Error in Resume Analyzer: ", err);
    return res.status(500).json({
      success: false,
      message: "Failed to analyze resume!",
    });
  }
};

module.exports = { ResumeAnalyzer };
