require("dotenv").config();
const { User } = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Login = async (req, res) => {
  try {
    const { email, password: pass } = req.body;

    const user = await User.findOne({
      $and: [{ email: email }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const isMatch = bcrypt.compare(pass, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password!",
      });
    }

    if (!user.isVerified) {
      return res.status(202).json({
        success: true,
        message: "Please verify to login!",
        User: {
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
        }
      });
    }

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
        message: `Welcome back ${user.username}!`,
        User: {
          id: user.id,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
        },
      });
  } catch (err) {
    console.log("Error in Logging In: ", err);
    return res.status(500).json({
      success: false,
      message: "Failed to LoginIn!",
    });
  }
};

module.exports = { Login };
