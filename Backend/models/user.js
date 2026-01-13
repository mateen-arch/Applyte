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
    applications: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application"
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
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    // Keep subscription field for backward compatibility, but prefer plan
    subscription: {
      plan: {
        type: String,
        enum: ["free", "pro", "business"],
        default: "free"
      },
      status: {
        type: String,
        enum: ["active", "cancelled", "expired", "trial"],
        default: "active"
      },
      startDate: {
        type: Date,
        default: Date.now
      },
      endDate: {
        type: Date
      },
      stripeCustomerId: {
        type: String,
        default: ""
      },
      stripeSubscriptionId: {
        type: String,
        default: ""
      }
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
