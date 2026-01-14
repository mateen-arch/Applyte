const { GoogleGenerativeAI } = require("@google/generative-ai");
const { skillGapAnalysisPrompt } = require("../AI/prompts");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const analyzeSkillGap = async (req, res) => {
    try {
        const { resumeSkills, jobDescription } = req.body;

        if (!resumeSkills || !jobDescription) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: resumeSkills or jobDescription",
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            },
        });

        const prompt = skillGapAnalysisPrompt(resumeSkills, jobDescription);
        const result = await model.generateContent(prompt);
        const response = result.response;

        if (!response || !response.text) {
            return res.status(502).json({
                success: false,
                message: "Received empty response from Gemini API",
            });
        }

        const text = response.text();
        const cleanText = text.trim();

        try {
            const analysis = JSON.parse(cleanText);
            return res.status(200).json({
                success: true,
                analysis,
            });
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            return res.status(502).json({
                success: false,
                message: "Failed to parse API response",
                error: parseError.message,
            });
        }
    } catch (error) {
        console.error("Skill Gap Analysis Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

module.exports = {
    analyzeSkillGap,
};
