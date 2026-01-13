const mongoose = require("mongoose");

// Timeline event schema
const TimelineEventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["applied", "status_updated", "note_added", "outcome_reached"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Main Application Schema
const ApplicationSchema = new mongoose.Schema(
  {
    // Reference to the user who owns this application
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Job information
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    jobPlatform: {
      type: String,
      required: true,
      trim: true, // LinkedIn, Indeed, Company Website, etc.
    },
    applicationUrl: {
      type: String,
      default: "",
      trim: true,
    },
    // Application details
    dateApplied: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["applied", "interview", "offer", "rejected"],
      default: "applied",
      required: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    // Document tracking
    resumeVersion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null,
    },
    coverLetter: {
      type: String,
      default: "",
      trim: true, // Can store AI-generated or uploaded cover letter text
    },
    coverLetterType: {
      type: String,
      enum: ["ai_generated", "uploaded", "none"],
      default: "none",
    },
    // Timeline for tracking application progress
    timeline: [TimelineEventSchema],
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` automatically
  }
);

// Add index for efficient queries
ApplicationSchema.index({ user: 1, createdAt: -1 });
ApplicationSchema.index({ user: 1, status: 1 });

// Create and export the model
const Application = mongoose.model("Application", ApplicationSchema);
module.exports = { Application };
