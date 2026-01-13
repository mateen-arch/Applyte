const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
      default: "",
    },
    resume: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume"
    }],
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    forgetPassOtp: {
      type: String,
    },
    forgetPassOtpExpiry: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    isVerified: {
        type: Boolean,
        default: false
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
