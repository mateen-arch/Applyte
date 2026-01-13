const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      enum: ["free", "pro", "business"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    stripePriceId: {
      type: String,
      required: true,
    },
    stripeProductId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired", "trial"],
      default: "active",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    stripeCustomerId: {
      type: String,
      default: "",
    },
    stripeSubscriptionId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);

// Helper functions to create plans
const createFreePlan = async (id) => {
  const newPlan = await Plan.create({
    userID: id,
    slug: "free",
    name: "Free",
    stripePriceId: "price_1SpACaIm5Jr0RQxlxk2qj6cN",
    stripeProductId: "prod_Tmjf7kLFdtFgAy",
    price: 0,
  });
  return newPlan._id;
};

const createProPlan = async (id) => {
  const newPlan = await Plan.create({
    userID: id,
    slug: "pro",
    name: "Pro",
    stripePriceId: "price_1Sp9tYIm5Jr0RQxl5HHhlb9V",
    stripeProductId: "prod_TmjM719MrOfBPd",
    price: 9.0,
  });
  return newPlan._id;
};

const createBusinessPlan = async (id) => {
  const newPlan = await Plan.create({
    userID: id,
    slug: "business",
    name: "Business",
    stripePriceId: "price_1Sp9tzIm5Jr0RQxlrnjY6v7d",
    stripeProductId: "prod_TmjMED54UtvA3Q",
    price: 19.0,
  });
  return newPlan._id;
};

module.exports = {
  Plan,
  createFreePlan,
  createProPlan,
  createBusinessPlan,
};
