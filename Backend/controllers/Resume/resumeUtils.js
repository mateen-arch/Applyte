const { Resume } = require("../../models/resume");
const { User } = require("../../models/user");

const getResume = async (req, res) => {
  try {
    const userID = req._id;
    const user = await User.findById(userID).populate("resume");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (!user.resume || user.resume.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No resume found!",
      });
    }

    // Get the most recent resume (last one in array)
    const resumeId = user.resume[user.resume.length - 1];
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found!",
      });
    }

    return res.status(200).json({
      success: true,
      Resume: resume,
    });
  } catch (e) {
    console.error("Error in Getting Resume:", e);
    console.error("Error stack:", e.stack);
    return res.status(500).json({
      success: false,
      message: "Error in fetching Resume!",
    });
  }
};

module.exports = { getResume };
