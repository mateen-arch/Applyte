const mongoose = require("mongoose");

// Sub-schema for Education
const EducationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true,
    trim: true,
  },
  field_of_study: {
    type: String,
    default: "", // Default to empty string if not provided
    trim: true,
  },
  university: {
    type: String,
    default: "", // Default to empty string if not provided
    trim: true,
  },
  start_date: {
    type: String, // Keeping as String since your API returns years like "2019"
    trim: true,
  },
  end_date: {
    type: String, // Keeping as String for consistency (e.g., "Present")
    trim: true,
  },
  grade: {
    type: String,
    default: "",
    trim: true,
  },
});

// Sub-schema for Experience
const ExperienceSchema = new mongoose.Schema({
  job_title: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    default: "",
    trim: true,
  },
  start_date: {
    type: String,
    trim: true,
  },
  end_date: {
    type: String,
    trim: true,
  },
  responsibilities: [
    {
      type: String,
      trim: true,
    },
  ],
});

// Sub-schema for Certifications
const CertificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  issuer: {
    type: String,
    default: "",
    trim: true,
  },
  date: {
    type: String,
    default: "",
    trim: true,
  },
});

// Sub-schema for Languages
const LanguageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  proficiency: {
    // e.g., "Native", "Fluent", "Intermediate", "Basic"
    type: String,
    trim: true,
  },
});

// Main Resume Schema
const ResumeSchema = new mongoose.Schema(
  {
    // Reference to the user who owns this resume
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    // Original file info (optional but useful)
    originalFileName: {
      type: String,
    },
    // The extracted data from Gemini
    personal_information: {
      full_name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please enter a valid email",
        ],
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
      linkedin: {
        type: String,
        default: "",
        trim: true,
      },
      github: {
        type: String,
        default: "",
        trim: true,
      },
      portfolio: {
        type: String,
        default: "",
        trim: true,
      },
    },
    description: {
      content: {
        type: String,
        trim: true,
      },
    },
    education: [EducationSchema],
    experience: [ExperienceSchema],
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    certifications: [CertificationSchema],
    projects: [
      {
        // Basic project structure based on your empty array
        name: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        technologies: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    ],
    languages: [LanguageSchema], // Now using the Language sub-schema
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` automatically
  }
);

// Create and export the model
const Resume = mongoose.model("Resume", ResumeSchema);
module.exports = { Resume };
