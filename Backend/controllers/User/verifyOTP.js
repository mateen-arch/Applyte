require("dotenv").config();
const { User } = require("../../models/user");
const jwt = require("jsonwebtoken");

const VerifyOTP = async (req, res) => {
  try {
    const { otp: OTP, email, user_email } = req.body;
    const emailToVerify = email || user_email || req.params?.email || req.query?.email;

    if (!OTP || !emailToVerify) {
      return res.status(400).json({
        success: false,
        message: "OTP and email are required!",
      });
    }

    // Find user by email first
    const user = await User.findOne({ email: emailToVerify });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Compare OTP as strings to avoid type issues
    if (user.otp.toString() !== OTP.toString()) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP!",
      });
    }

    // Check if OTP is expired
    const currTime = Date.now();
    if (currTime > user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired!",
      });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = null; // optional: clear OTP after verification
    user.otpExpiry = null;
    await user.save();

    // Generate JWT
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
