require('dotenv').config();
const { User } = require("../../models/user");

const Logout = async (req, res) => {
  try {
    const userID = req._id;
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.JWT_SECRET,
      })
      .json({
        success: true,
        message: `Good Bye ${user.username}!`,
      });
  } catch (e) {
    console.log("Error in Logout: ", e);
    return res.status(500).json({
      success: false,
      message: "Failed to logout!",
    });
  }
};


module.exports = {
    Logout
}