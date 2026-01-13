require("dotenv").config();
const { User } = require("../../models/user");
const jwt = require("jsonwebtoken");

const VerifyOTP = async (req, res) => {
  try {
    const { otp: OTP } = req.body;
    const user = await User.findOne({ otp: OTP });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Please enter correct OTP!",
      });
    }

    const currTime = Date.now();

    if (currTime > user.otpExpiry + 10 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: "OTP is expired!",
      });
    }

    user.isVerified = true;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: `Welcome ${user.username}!`,
        User: {
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
        },
      });
  } catch (err) {
    console.log("Error in OTP verification: ", err);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP!",
    });
  }
};

module.exports = { VerifyOTP };
