const { User } = require("../../models/user");
const { sendEmail } = require("../../utils/EmailUtils/sendEmail");

const resendOTP = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist!",
      });
    }

    const currTime = Date.now();

    if (currTime <= user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "Previous OTP is still valid! Please wait for it to expire.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setHours(otpExpiry.getHours() + 1);

    // Send verification email
    const isEmailSent = await sendEmail(email, user.username, otp);

    if (!isEmailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please check your email address and try again.",
      });
    }

    // Update user with new OTP and expiry
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully!",
    });
  } catch (e) {
    console.error("Error in resending the OTP:", e);
    console.error("Error stack:", e.stack);
    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP. Please try again later.",
    });
  }
};

module.exports = {
  resendOTP,
};
