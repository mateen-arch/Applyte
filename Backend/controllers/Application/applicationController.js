const { Application } = require("../../models/application");
const { User } = require("../../models/user");
const { Resume } = require("../../models/resume");
const { generateFollowUpEmail } = require("../AI/functionality");
const { extractJsonStringAdvanced } = require("../../utils/extractJsonHelper");

// Create a new application
const createApplication = async (req, res) => {
  try {
    const userID = req._id;
    const {
      jobTitle,
      companyName,
      location,
      jobPlatform,
      applicationUrl,
      dateApplied,
      resumeVersion,
      coverLetter,
      coverLetterType,
    } = req.body;

    // Validate required fields
    if (!jobTitle || !companyName || !jobPlatform) {
      return res.status(400).json({
        success: false,
        message: "Job title, company name, and platform are required!",
      });
    }

    // Validate user exists
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Validate resume version if provided
    if (resumeVersion) {
      const resume = await Resume.findById(resumeVersion);
      if (!resume || resume.user.toString() !== userID.toString()) {
        return res.status(400).json({
          success: false,
          message: "Invalid resume version!",
        });
      }
    }

    // Create application
    const application = await Application.create({
      user: userID,
      jobTitle,
      companyName,
      location: location || "",
      jobPlatform,
      applicationUrl: applicationUrl || "",
      dateApplied: dateApplied ? new Date(dateApplied) : new Date(),
      status: "applied",
      resumeVersion: resumeVersion || null,
      coverLetter: coverLetter || "",
      coverLetterType: coverLetterType || "none",
      timeline: [
        {
          type: "applied",
          description: `Applied for ${jobTitle} at ${companyName}`,
          date: new Date(),
        },
      ],
    });

    // Link application to user
    if (!user.applications) {
      user.applications = [];
    }
    user.applications.push(application._id);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Application created successfully!",
      application,
    });
  } catch (err) {
    console.error("Error in Create Application:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create application!",
    });
  }
};

// Get all applications for a user
const getAllApplications = async (req, res) => {
  try {
    const userID = req._id;

    const applications = await Application.find({ user: userID })
      .populate("resumeVersion", "personal_information.full_name createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully!",
      applications,
      count: applications.length,
    });
  } catch (err) {
    console.error("Error in Get All Applications:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications!",
    });
  }
};

// Get a single application by ID
const getApplication = async (req, res) => {
  try {
    const userID = req._id;
    const { id } = req.params;

    const application = await Application.findOne({
      _id: id,
      user: userID,
    }).populate("resumeVersion");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application fetched successfully!",
      application,
    });
  } catch (err) {
    console.error("Error in Get Application:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch application!",
    });
  }
};

// Update application
const updateApplication = async (req, res) => {
  try {
    const userID = req._id;
    const { id } = req.params;
    const {
      jobTitle,
      companyName,
      location,
      jobPlatform,
      applicationUrl,
      dateApplied,
      status,
      notes,
      resumeVersion,
      coverLetter,
      coverLetterType,
    } = req.body;

    const application = await Application.findOne({
      _id: id,
      user: userID,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found!",
      });
    }

    // Track status changes in timeline
    if (status && status !== application.status) {
      const statusLabels = {
        applied: "Applied",
        interview: "Interview",
        offer: "Offer",
        rejected: "Rejected",
      };
      application.timeline.push({
        type: "status_updated",
        description: `Status changed to ${statusLabels[status]}`,
        date: new Date(),
      });
    }

    // Track note additions
    if (notes && notes !== application.notes && notes.trim() !== "") {
      application.timeline.push({
        type: "note_added",
        description: "Note added",
        date: new Date(),
      });
    }

    // Update fields
    if (jobTitle) application.jobTitle = jobTitle;
    if (companyName) application.companyName = companyName;
    if (location !== undefined) application.location = location;
    if (jobPlatform) application.jobPlatform = jobPlatform;
    if (applicationUrl !== undefined) application.applicationUrl = applicationUrl;
    if (dateApplied) application.dateApplied = new Date(dateApplied);
    if (status) application.status = status;
    if (notes !== undefined) application.notes = notes;
    if (resumeVersion !== undefined) application.resumeVersion = resumeVersion || null;
    if (coverLetter !== undefined) application.coverLetter = coverLetter;
    if (coverLetterType) application.coverLetterType = coverLetterType;

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application updated successfully!",
      application,
    });
  } catch (err) {
    console.error("Error in Update Application:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update application!",
    });
  }
};

// Delete application
const deleteApplication = async (req, res) => {
  try {
    const userID = req._id;
    const { id } = req.params;

    const application = await Application.findOne({
      _id: id,
      user: userID,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found!",
      });
    }

    // Remove from user's applications array
    const user = await User.findById(userID);
    if (user && user.applications) {
      user.applications = user.applications.filter(
        (appId) => appId.toString() !== id
      );
      await user.save();
    }

    // Delete application
    await Application.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully!",
    });
  } catch (err) {
    console.error("Error in Delete Application:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete application!",
    });
  }
};

// Get application analytics
const getApplicationAnalytics = async (req, res) => {
  try {
    const userID = req._id;

    const applications = await Application.find({ user: userID });

    const totalApplications = applications.length;
    const interviews = applications.filter((app) => app.status === "interview").length;
    const offers = applications.filter((app) => app.status === "offer").length;
    const rejected = applications.filter((app) => app.status === "rejected").length;
    const rejectionRate =
      totalApplications > 0
        ? ((rejected / totalApplications) * 100).toFixed(1)
        : 0;

    // Find best-performing resume (most interviews/offers)
    const resumePerformance = {};
    applications.forEach((app) => {
      if (app.resumeVersion) {
        const resumeId = app.resumeVersion.toString();
        if (!resumePerformance[resumeId]) {
          resumePerformance[resumeId] = {
            resumeId,
            applications: 0,
            interviews: 0,
            offers: 0,
          };
        }
        resumePerformance[resumeId].applications++;
        if (app.status === "interview") resumePerformance[resumeId].interviews++;
        if (app.status === "offer") resumePerformance[resumeId].offers++;
      }
    });

    let bestResume = null;
    let bestScore = 0;
    Object.values(resumePerformance).forEach((perf) => {
      const score = perf.interviews * 2 + perf.offers * 5; // Weight offers higher
      if (score > bestScore) {
        bestScore = score;
        bestResume = perf.resumeId;
      }
    });

    // Find best-performing cover letter (most interviews/offers)
    const coverLetterPerformance = {};
    applications.forEach((app) => {
      if (app.coverLetter && app.coverLetter.trim() !== "") {
        const coverLetterKey = app.coverLetterType || "unknown";
        if (!coverLetterPerformance[coverLetterKey]) {
          coverLetterPerformance[coverLetterKey] = {
            type: coverLetterKey,
            applications: 0,
            interviews: 0,
            offers: 0,
          };
        }
        coverLetterPerformance[coverLetterKey].applications++;
        if (app.status === "interview")
          coverLetterPerformance[coverLetterKey].interviews++;
        if (app.status === "offer")
          coverLetterPerformance[coverLetterKey].offers++;
      }
    });

    let bestCoverLetter = null;
    let bestCoverLetterScore = 0;
    Object.values(coverLetterPerformance).forEach((perf) => {
      const score = perf.interviews * 2 + perf.offers * 5;
      if (score > bestCoverLetterScore) {
        bestCoverLetterScore = score;
        bestCoverLetter = perf.type;
      }
    });

    return res.status(200).json({
      success: true,
      message: "Analytics fetched successfully!",
      analytics: {
        totalApplications,
        interviews,
        offers,
        rejected,
        rejectionRate: parseFloat(rejectionRate),
        bestResume: bestResume || null,
        bestCoverLetter: bestCoverLetter || null,
        statusDistribution: {
          applied: applications.filter((app) => app.status === "applied").length,
          interview: interviews,
          offer: offers,
          rejected: rejected,
        },
      },
    });
  } catch (err) {
    console.error("Error in Get Application Analytics:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics!",
    });
  }
};

// Generate AI follow-up email
const generateFollowUp = async (req, res) => {
  try {
    const userID = req._id;
    const { applicationId, daysSinceApplication, emailType } = req.body;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required!",
      });
    }

    const application = await Application.findOne({
      _id: applicationId,
      user: userID,
    }).populate("resumeVersion");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found!",
      });
    }

    // Generate follow-up email using AI
    const followUpEmail = await generateFollowUpEmail(
      application,
      daysSinceApplication || 7,
      emailType || "follow_up"
    );

    if (!followUpEmail) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate follow-up email!",
      });
    }

    // Parse AI response
    const cleanJSON = extractJsonStringAdvanced(followUpEmail);
    const emailData = JSON.parse(cleanJSON);

    return res.status(200).json({
      success: true,
      message: "Follow-up email generated successfully!",
      email: emailData,
    });
  } catch (err) {
    console.error("Error in Generate Follow-Up:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to generate follow-up email!",
    });
  }
};

module.exports = {
  createApplication,
  getAllApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  getApplicationAnalytics,
  generateFollowUp,
};
