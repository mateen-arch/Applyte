const { Resume } = require("../../models/resume");
const { User } = require("../../models/user");

const getResume = async (req, res) => {
  try {
    const userID = req._id;
    const user = await User.findById(userID);

    if (!user) {
      return res.status(400).json({
        success: false,
      });
    }

    if (!user.resume) {
      return res.status(400).json({
        success: false,
      });
    }

    const resume = await Resume.findById(user.resume);

    if (!resume) {
      return res.status(400).json({
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      Resume: resume,
    });
  } catch (e) {
    console.log("Error in Getting Resume: ", e);
    return res.status(500).json({
      success: false,
      message: "Error in fetching Resume!",
    });
  }
};

module.exports = { getResume };
