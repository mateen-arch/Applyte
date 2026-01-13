require("dotenv").config();
const {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} = require("@google/genai");
const mime = require("mime-types");
const {
  resumeAnalyzerPrompt,
  jobSearchQueryGeneratorPromt,
  resumeCustomizationPrompt,
  followUpEmailPrompt,
} = require("./prompts");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_KEY,
});

// ==================== UTILITIES ====================

// Delay utility
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

const getCachedOrGenerate = async (cacheKey, generateFn) => {
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("✅ Using cached response for:", cacheKey);
    return cached.value;
  }
  
  const value = await generateFn();
  cache.set(cacheKey, { value, timestamp: Date.now() });
  return value;
};

// Request Queue to manage rate limits
class RequestQueue {
  constructor(maxConcurrent = 1, minDelay = 15000) { // 15s between requests
    this.queue = [];
    this.running = 0;
    this.maxConcurrent = maxConcurrent;
    this.minDelay = minDelay;
    this.lastRequestTime = 0;
  }

  async add(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const { fn, resolve, reject } = this.queue.shift();
    this.running++;

    try {
      // Enforce minimum delay between requests
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < this.minDelay) {
        const waitTime = this.minDelay - timeSinceLastRequest;
        console.log(`⏳ Rate limit protection: waiting ${waitTime/1000}s...`);
        await delay(waitTime);
      }
      
      this.lastRequestTime = Date.now();
      const result = await fn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.process(); // Process next in queue
    }
  }
}

// Global queue for all Gemini API calls
const geminiQueue = new RequestQueue(1, 15000); // 1 concurrent request, 15s delay

// Retry with exponential backoff
const generateContentWithRetry = async (config, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent(config);
      return response.text;
    } catch (error) {
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, error.message);
      
      if (error.status === 429) {
        // Rate limit error
        const retryMatch = error.message.match(/retry in ([\d.]+)s/);
        const waitTime = retryMatch 
          ? parseFloat(retryMatch[1]) * 1000 + 2000 // Add 2s buffer
          : Math.pow(2, attempt) * 1000; // Exponential backoff
        
        console.log(`⏳ Rate limit hit. Waiting ${waitTime/1000}s before retry...`);
        
        if (attempt < maxRetries) {
          await delay(waitTime);
          continue;
        }
      }
      
      // If it's the last attempt or non-429 error, throw
      if (attempt === maxRetries) {
        throw error;
      }
    }
  }
};

// ==================== FALLBACK FUNCTIONS ====================

const buildFallbackQuery = (resumeData) => {
  try {
    const parsed = typeof resumeData === 'string' ? JSON.parse(resumeData) : resumeData;
    
    let query = '';
    
    // Add job title or top skill
    if (parsed.desiredPosition) {
      query = `"${parsed.desiredPosition}"`;
    } else if (parsed.skills && parsed.skills.length > 0) {
      query = `"${parsed.skills[0]}"`;
    } else if (parsed.experience && parsed.experience.length > 0) {
      query = `"${parsed.experience[0].title || parsed.experience[0].position}"`;
    }
    
    // Add top skills
    if (parsed.skills && parsed.skills.length > 0) {
      const topSkills = parsed.skills.slice(0, 3).map(s => `"${s}"`).join(' OR ');
      query += ` (${topSkills})`;
    }
    
    // Add location if available
    if (parsed.location) {
      query += ` "${parsed.location}"`;
    }
    
    // Add remote options
    query += ' (remote OR "work from home" OR WFH OR hybrid OR "on-site")';
    
    console.log("📝 Fallback query generated:", query);
    return query;
  } catch (error) {
    console.error("Error in fallback query builder:", error);
    return '"software developer" remote'; // Ultimate fallback
  }
};

// ==================== MAIN FUNCTIONS ====================

const resumeAnalyzerHelper = async (resume) => {
  try {
    console.log("📄 Analyzing resume...");
    
    // Create cache key based on file size and name (simple hash)
    const cacheKey = `resume-${resume.size}-${resume.originalname}`;
    
    return await getCachedOrGenerate(cacheKey, async () => {
      return await geminiQueue.add(async () => {
        // Convert the buffer to a base64 string
        const base64Data = resume.buffer.toString("base64");

        const config = {
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
        };

        return await generateContentWithRetry(config);
      });
    });
  } catch (err) {
    console.error("❌ Error in Resume Analyzer Helper:", err.message);
    
    // Return a basic error response instead of throwing
    return JSON.stringify({
      error: "Failed to analyze resume",
      message: "Please try again later or contact support",
      skills: [],
      experience: [],
      education: []
    });
  }
};

const generateQuery = async (resumeData) => {
  try {
    console.log("🔍 Generating search query...");
    
    // Create cache key
    const dataString = typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData);
    const cacheKey = `query-${dataString.slice(0, 100)}`; // Use first 100 chars as key
    
    return await getCachedOrGenerate(cacheKey, async () => {
      return await geminiQueue.add(async () => {
        const config = {
          model: "gemini-2.5-flash",
          contents: jobSearchQueryGeneratorPromt(resumeData),
        };

        try {
          const result = await generateContentWithRetry(config);
          console.log("✅ AI-generated query:", result);
          return result;
        } catch (error) {
          console.error("AI query generation failed, using fallback");
          return buildFallbackQuery(resumeData);
        }
      });
    });
  } catch (err) {
    console.error("❌ Error in Query Generator:", err.message);
    // Always return a fallback query instead of throwing
    return buildFallbackQuery(resumeData);
  }
};

const generateResumeSuggestions = async (resumeData) => {
  try {
    console.log("💡 Generating resume suggestions...");
    
    const dataString = typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData);
    const cacheKey = `suggestions-${dataString.slice(0, 100)}`;
    
    return await getCachedOrGenerate(cacheKey, async () => {
      return await geminiQueue.add(async () => {
        const prompt = resumeCustomizationPrompt(resumeData);
        const config = {
          model: "gemini-2.5-flash",
          contents: prompt,
        };

        return await generateContentWithRetry(config);
      });
    });
  } catch (err) {
    console.error("❌ Error in Resume Suggestions Generator:", err.message);
    
    // Return basic suggestions as fallback
    return JSON.stringify({
      suggestions: [
        "Add more quantifiable achievements to your experience section",
        "Include relevant keywords from job descriptions",
        "Ensure your skills section is comprehensive and up-to-date",
        "Add a professional summary at the top of your resume"
      ],
      error: "AI suggestions unavailable, showing general tips"
    });
  }
};

const generateFollowUpEmail = async (application, daysSinceApplication, emailType) => {
  try {
    console.log("✉️ Generating follow-up email...");
    
    const cacheKey = `email-${application.jobId}-${emailType}-${daysSinceApplication}`;
    
    return await getCachedOrGenerate(cacheKey, async () => {
      return await geminiQueue.add(async () => {
        const prompt = followUpEmailPrompt(application, daysSinceApplication, emailType);
        const config = {
          model: "gemini-2.5-flash",
          contents: prompt,
        };

        return await generateContentWithRetry(config);
      });
    });
  } catch (err) {
    console.error("❌ Error in Follow-Up Email Generator:", err.message);
    
    // Return a basic template as fallback
    return `Subject: Following Up on ${application.jobTitle} Application

Dear Hiring Manager,

I hope this email finds you well. I am writing to follow up on my application for the ${application.jobTitle} position that I submitted ${daysSinceApplication} days ago.

I remain very interested in this opportunity and would welcome the chance to discuss how my skills and experience align with your needs.

Thank you for your consideration, and I look forward to hearing from you.

Best regards,
[Your Name]`;
  }
};

// Clear old cache entries periodically (every hour)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
  console.log(`🧹 Cache cleaned. Current size: ${cache.size} entries`);
}, CACHE_DURATION);

module.exports = { 
  resumeAnalyzerHelper, 
  generateQuery, 
  generateResumeSuggestions, 
  generateFollowUpEmail 
};