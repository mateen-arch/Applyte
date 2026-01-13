const bcrypt = require("bcrypt");
const { User } = require("../../models/user");
const { sendEmail } = require("../../utils/EmailUtils/sendEmail");

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
        isEmailPresent.username = name;
        isEmailPresent.password = await bcrypt.hash(password, 12);
        isEmailPresent.otp = otp;
        isEmailPresent.otpExpiry = isEmailPresent.otpExpiry.setHours(
          isEmailPresent.otpExpiry.getHours() + 1
        );
        await isEmailPresent.save();
      }
    } else {
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

    const isEmailSent = await sendEmail(email, name, otp);

    if (!isEmailSent) {
      await User.findOneAndDelete({ email: email });
      return res.status(400).json({
        success: false,
        message: "Something went wrong!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Please verify your account!",
      email: email
    });
  } catch (err) {
    console.log("Error in Signup: ", err);
    return res.status(500).json({
      success: false,
      message: "Signup failed!",
    });
  }
};

module.exports = { Signup };
