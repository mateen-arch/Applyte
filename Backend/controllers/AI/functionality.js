require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const {
  jobSearchQueryGeneratorPromt,
  resumeAnalyzerPrompt,
  resumeCustomizationPrompt,
} = require("./prompts");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_KEY,
});

// ==================== UTILITIES ====================

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 60;

const getCachedOrGenerate = async (cacheKey, generateFn) => {
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.value;
  }

  const value = await generateFn();
  cache.set(cacheKey, { value, timestamp: Date.now() });
  return value;
};

const resumeAnalyzerHelper = async (resume) => {
  try {
    // Convert the buffer to a base64 string
    const base64Data = Buffer.from(resume.buffer).toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: resume.mimetype,
                data: base64Data,
              },
            },
            { text: resumeAnalyzerPrompt },
          ],
        },
      ],
    });

    return response.text;
  } catch (err) {
    console.log("Error in Resume Analyzer Helper: ", err);
    throw err;
  }
};

const generateQuery = async (resumeData) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: jobSearchQueryGeneratorPromt(resumeData),
    });

    return response.text;
  } catch (err) {
    console.log("Error in Query Generator: ", err);
    throw err;
  }
};

const generateResumeSuggestions = async (resumeData) => {
  try {
    const prompt = resumeCustomizationPrompt(resumeData);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (err) {
    console.log("Error in Resume Suggestions Generator: ", err);
    throw err;
  }
};

const generateFollowUpEmail = async (
  application,
  daysSinceApplication,
  emailType
) => {
  try {
    if (!application?.jobTitle) {
      return "Subject: Follow-up on Job Application\n\nDear Hiring Manager,\n\nI'm following up on my recent application.\n\nBest regards,\n[Your Name]";
    }

    const cacheKey = `email-${
      application.jobId || "unknown"
    }-${emailType}-${daysSinceApplication}`;

    return await getCachedOrGenerate(cacheKey, async () => {
      return await geminiQueue.add(async () => {
        const prompt = followUpEmailPrompt(
          application,
          daysSinceApplication,
          emailType
        );
        const config = {
          model: "gemini-2.5-flash",
          contents: prompt,
        };
        return await generateContentWithRetry(config);
      });
    });
  } catch (err) {
    return `Subject: Following Up on ${
      application?.jobTitle || "Job Application"
    }

Dear Hiring Manager,

I'm following up on my application submitted ${daysSinceApplication} days ago.

Best regards,
[Your Name]`;
  }
};

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, CACHE_DURATION);

module.exports = {
  resumeAnalyzerHelper,
  generateQuery,
  generateResumeSuggestions,
  generateFollowUpEmail,
};
