const bcrypt = require("bcrypt");
const { User } = require("../../models/user");
const { sendEmail } = require("../../utils/EmailUtils/sendEmail");
const { ensureUserPlan } = require("../../utils/planHelpers");

const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const isEmailPresent = await User.findOne({ email: email });
    if (isEmailPresent) {
      if (isEmailPresent.isVerified) {
        return res.status(400).json({
          success: false,
          message: "Email already exist!",
        });
      } else {
        // Update existing unverified user
        const otpExpiry = new Date();
        otpExpiry.setHours(otpExpiry.getHours() + 1);
        
        isEmailPresent.username = name;
        isEmailPresent.password = await bcrypt.hash(password, 12);
        isEmailPresent.otp = otp;
        isEmailPresent.otpExpiry = otpExpiry;
        await isEmailPresent.save();
      }
    } else {
      // Create new user
      const otpExpiry = new Date();
      otpExpiry.setHours(otpExpiry.getHours() + 1);
      await User.create({
        username: name,
        email,
        password: await bcrypt.hash(password, 12),
        otp,
        otpExpiry,
      });
    }

    // Send verification email
    const isEmailSent = await sendEmail(email, name, otp);

    if (!isEmailSent) {
      // Clean up: delete the user if email sending failed
      // But only if it's a new user (not updating existing)
      if (!isEmailPresent) {
      await User.findOneAndDelete({ email: email });
      }
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please check your email address and try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Please verify your account!",
      email: email
    });
  } catch (err) {
    console.error("Error in Signup:", err);
    console.error("Error stack:", err.stack);
    return res.status(500).json({
      success: false,
      message: "Signup failed! Please try again later.",
    });
  }
};

module.exports = { Signup };
