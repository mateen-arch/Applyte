const { Resume } = require("../../models/resume");
const { User } = require("../../models/user");
const { extractJsonStringAdvanced } = require("../../utils/extractJsonHelper");
const { generateResumeSuggestions } = require("../AI/functionality");
const { isPremiumUser } = require("../../utils/planHelpers");

const getResumeSuggestions = async (req, res) => {
  try {
    const userID = req._id;
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Check plan (prefer Plan model over subscription field)
    const isPremium = await isPremiumUser(userID);
    if (!isPremium) {
      return res.status(403).json({
        success: false,
        message: "Premium subscription required for this feature! Please upgrade to Pro or Business plan.",
      });
    }

    // Get user's resume
    if (!user.resume || user.resume.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No resume found! Please upload a resume first.",
      });
    }

    const resumeId = user.resume[user.resume.length - 1];
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found!",
      });
    }

    // Generate AI suggestions
    const resumeData = resume.toObject();
    const aiResponse = await generateResumeSuggestions(resumeData);

    if (!aiResponse) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate suggestions!",
      });
    }

    // Parse AI response
    const cleanJSON = extractJsonStringAdvanced(aiResponse);
    const suggestions = JSON.parse(cleanJSON);

    return res.status(200).json({
      success: true,
      message: "Suggestions generated successfully!",
      suggestions: suggestions,
    });
  } catch (err) {
    console.error("Error in Resume Customization:", err);
    console.error("Error stack:", err.stack);
    return res.status(500).json({
      success: false,
      message: "Failed to generate resume suggestions!",
    });
  }
};

const updateResumeWithSuggestion = async (req, res) => {
  try {
    const userID = req._id;
    const { fieldPath, newValue, suggestionId } = req.body;

    if (!fieldPath || newValue === undefined) {
      return res.status(400).json({
        success: false,
        message: "Field path and new value are required!",
      });
    }

    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Check plan (prefer Plan model over subscription field)
    const isPremium = await isPremiumUser(userID);
    if (!isPremium) {
      return res.status(403).json({
        success: false,
        message: "Premium subscription required for this feature! Please upgrade to Pro or Business plan.",
      });
    }

    // Get user's resume
    if (!user.resume || user.resume.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No resume found!",
      });
    }

    const resumeId = user.resume[user.resume.length - 1];
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found!",
      });
    }

    // Parse field path (e.g., "experience[0].responsibilities[1]" or "personal_information.email")
    const updateResumeField = (obj, path, value) => {
      // Convert to plain object if it's a Mongoose document
      const plainObj = obj.toObject ? obj.toObject() : JSON.parse(JSON.stringify(obj));
      
      // Parse path: handle both dot notation and bracket notation
      const parts = path.split(/[\[\]\.]/).filter(p => p !== "");
      
      let current = plainObj;
      
      // Navigate to the parent of the target field
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        const nextKey = parts[i + 1];
        
        // Check if current key points to an array
        if (Array.isArray(current[key])) {
          const index = parseInt(nextKey);
          if (isNaN(index)) {
            throw new Error(`Invalid array index: ${nextKey}`);
          }
          if (!current[key][index]) {
            current[key][index] = {};
          }
          current = current[key][index];
          i++; // Skip next key as we already used it as index
        } else {
          // It's an object
          if (!current[key] || typeof current[key] !== "object") {
            // Check if next key is numeric (array index)
            if (!isNaN(nextKey)) {
              current[key] = [];
            } else {
              current[key] = {};
            }
          }
          current = current[key];
        }
      }
      
      // Set the value
      const lastKey = parts[parts.length - 1];
      if (Array.isArray(current)) {
        const index = parseInt(lastKey);
        if (isNaN(index)) {
          throw new Error(`Invalid array index: ${lastKey}`);
        }
        current[index] = value;
      } else {
        current[lastKey] = value;
      }
      
      return plainObj;
    };

    // Apply the update
    const resumeObj = updateResumeField(resume, fieldPath, newValue);

    // Update resume in database
    const updatedResume = await Resume.findByIdAndUpdate(resumeId, resumeObj, { new: true, runValidators: true });

    return res.status(200).json({
      success: true,
      message: "Resume updated successfully!",
      resume: updatedResume,
    });
  } catch (err) {
    console.error("Error in updating resume:", err);
    console.error("Error stack:", err.stack);
    return res.status(500).json({
      success: false,
      message: "Failed to update resume!",
    });
  }
};

const updateResume = async (req, res) => {
  try {
    const userID = req._id;
    const { updates } = req.body;

    if (!updates || typeof updates !== "object") {
      return res.status(400).json({
        success: false,
        message: "Updates object is required!",
      });
    }

    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Check plan (prefer Plan model over subscription field)
    const isPremium = await isPremiumUser(userID);
    if (!isPremium) {
      return res.status(403).json({
        success: false,
        message: "Premium subscription required for this feature! Please upgrade to Pro or Business plan.",
      });
    }

    // Get user's resume
    if (!user.resume || user.resume.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No resume found!",
      });
    }

    const resumeId = user.resume[user.resume.length - 1];
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found!",
      });
    }

    // Update resume fields
    Object.keys(updates).forEach(key => {
      if (resume[key] !== undefined) {
        resume[key] = updates[key];
      }
    });

    await resume.save();

    return res.status(200).json({
      success: true,
      message: "Resume updated successfully!",
      resume: resume,
    });
  } catch (err) {
    console.error("Error in updating resume:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update resume!",
    });
  }
};

module.exports = { getResumeSuggestions, updateResumeWithSuggestion, updateResume };
