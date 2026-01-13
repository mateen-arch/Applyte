const { Plan, createFreePlan } = require("../models/plan");

/**
 * Get or create a free plan for a user
 */
const ensureUserPlan = async (userId) => {
  try {
    // Check if user already has a plan
    const existingPlan = await Plan.findOne({ userID: userId });
    if (existingPlan) {
      return existingPlan;
    }

    // Create free plan for new user
    const planId = await createFreePlan(userId);
    const plan = await Plan.findById(planId);
    return plan;
  } catch (error) {
    console.error("Error ensuring user plan:", error);
    throw error;
  }
};

/**
 * Check if user has premium plan (pro or business)
 */
const isPremiumUser = async (userId) => {
  try {
    const plan = await Plan.findOne({ userID: userId });
    if (!plan) {
      return false;
    }
    return (plan.slug === "pro" || plan.slug === "business") && plan.status === "active";
  } catch (error) {
    console.error("Error checking premium status:", error);
    return false;
  }
};

/**
 * Get user's plan slug
 */
const getUserPlanSlug = async (userId) => {
  try {
    const plan = await Plan.findOne({ userID: userId });
    if (!plan) {
      return "free";
    }
    return plan.slug;
  } catch (error) {
    console.error("Error getting user plan slug:", error);
    return "free";
  }
};

/**
 * Update user's plan
 */
const updateUserPlan = async (userId, planSlug) => {
  try {
    const validSlugs = ["free", "pro", "business"];
    if (!validSlugs.includes(planSlug)) {
      throw new Error("Invalid plan slug");
    }

    let plan = await Plan.findOne({ userID: userId });

    if (!plan) {
      // Create new plan
      const { createFreePlan, createProPlan, createBusinessPlan } = require("../models/plan");
      if (planSlug === "free") {
        await createFreePlan(userId);
      } else if (planSlug === "pro") {
        await createProPlan(userId);
      } else if (planSlug === "business") {
        await createBusinessPlan(userId);
      }
      plan = await Plan.findOne({ userID: userId });
    } else {
      // Update existing plan
      const { createProPlan, createBusinessPlan } = require("../models/plan");
      
      // Delete old plan
      await Plan.findByIdAndDelete(plan._id);
      
      // Create new plan
      if (planSlug === "free") {
        await createFreePlan(userId);
      } else if (planSlug === "pro") {
        await createProPlan(userId);
      } else if (planSlug === "business") {
        await createBusinessPlan(userId);
      }
      plan = await Plan.findOne({ userID: userId });
    }

    return plan;
  } catch (error) {
    console.error("Error updating user plan:", error);
    throw error;
  }
};

module.exports = {
  ensureUserPlan,
  isPremiumUser,
  getUserPlanSlug,
  updateUserPlan,
};
