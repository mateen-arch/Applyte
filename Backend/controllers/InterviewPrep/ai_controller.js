require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  questionAnswerPrompt,
  questionExplanation,
} = require("./prompt");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY); // Fixed variable name

const generateQuestions = async (req, res) => {
  try {
    const { role, experience, topics, desc, numberOfQuestions } = req.body;

    // Validate required fields
    if (!role || !experience || !topics || !numberOfQuestions) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: role, experience, topics, or numberOfQuestions",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // Updated to current recommended model
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topics,
      desc,
      numberOfQuestions
    );
    const result = await model.generateContent(prompt);
    const response = result.response;

    if (!response || !response.text) {
      return res.status(502).json({
        success: false,
        message: "Received empty response from Gemini API",
      });
    }

    // Parse and clean the response
    const text = response.text();
    const cleanText = text
      .trim();

    try {
      const questions = JSON.parse(cleanText);

      // Validate the question structure
      if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(502).json({
          success: false,
          message: "Invalid question format received from API",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Questions generated successfully",
        questions,
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
    console.error("API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while generating questions",
      error: error.message,
    });
  }
};

const generateExplanation = async (question) => {
  try {
    // Validate input
    if (!question?.trim()) {
      throw new Error("Missing or empty question");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = questionExplanation(question);
    const result = await model.generateContent(prompt);
    const response = result.response;

    if (!response?.text) {
      throw new Error("Empty response from Gemini API");
    }

    // Parse response
    const text = response.text();
    const cleanText = text
      .trim();

    const data = JSON.parse(cleanText);

    if (!data.title || !data.explanation) {
      throw Error("Invalid explanation format received from API");
    }

    return data;
  } catch (error) {
    console.error("Explanation generation failed:", error);
    return error; // Return error object to be handled by caller
  }
};

module.exports = {
  generateExplanation,
  generateQuestions,
};