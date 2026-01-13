const { User } = require("../../models/user");
const { Plan } = require("../../models/plan");
const { updateUserPlan, ensureUserPlan } = require("../../utils/planHelpers");

const updateSubscription = async (req, res) => {
  try {
    const userID = req._id;
    const { plan: planSlug, status } = req.body;

    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Validate plan
    const validPlans = ["free", "pro", "business"];
    if (planSlug && !validPlans.includes(planSlug)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription plan!",
      });
    }

    // Validate status
    const validStatuses = ["active", "cancelled", "expired", "trial"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription status!",
      });
    }

    // Update plan using Plan model
    if (planSlug) {
      const updatedPlan = await updateUserPlan(userID, planSlug);
      
      // Update plan status if provided
      if (status) {
        updatedPlan.status = status;
        
        // Set end date for paid plans (30 days from now)
        if (planSlug !== "free" && status === "active") {
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 30);
          updatedPlan.endDate = endDate;
        }
        
        await updatedPlan.save();
      }

      // Update user's plan reference
      user.plan = updatedPlan._id;
      
      // Also update subscription field for backward compatibility
      if (!user.subscription) {
        user.subscription = {
          plan: planSlug,
          status: status || updatedPlan.status,
          startDate: updatedPlan.startDate,
          endDate: updatedPlan.endDate,
        };
      } else {
        user.subscription.plan = planSlug;
        if (status) {
          user.subscription.status = status;
        }
        if (planSlug !== "free" && status === "active") {
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 30);
          user.subscription.endDate = endDate;
        }
      }
      
      await user.save();
    } else if (status) {
      // Only update status
      const plan = await Plan.findOne({ userID: userID });
      if (plan) {
        plan.status = status;
        await plan.save();
      }
      
      // Update subscription field for backward compatibility
      if (user.subscription) {
        user.subscription.status = status;
        await user.save();
      }
    }

    // Get updated plan
    const finalPlan = await Plan.findOne({ userID: userID });

    return res.status(200).json({
      success: true,
      message: "Subscription updated successfully!",
      plan: finalPlan ? {
        _id: finalPlan._id,
        slug: finalPlan.slug,
        name: finalPlan.name,
        price: finalPlan.price,
        status: finalPlan.status,
      } : null,
      subscription: user.subscription || {
        plan: finalPlan?.slug || "free",
        status: finalPlan?.status || "active",
      },
    });
  } catch (err) {
    console.error("Error in updating subscription:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update subscription!",
    });
  }
};

const getSubscription = async (req, res) => {
  try {
    const userID = req._id;
    const user = await User.findById(userID).populate("plan");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Ensure user has a plan
    let plan = user.plan;
    if (!plan) {
      plan = await ensureUserPlan(userID);
      user.plan = plan._id;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      plan: plan ? {
        _id: plan._id,
        slug: plan.slug,
        name: plan.name,
        price: plan.price,
        status: plan.status,
      } : null,
      subscription: {
        plan: plan?.slug || "free",
        status: plan?.status || "active",
      },
    });
  } catch (err) {
    console.error("Error in getting subscription:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to get subscription!",
    });
  }
};

module.exports = { updateSubscription, getSubscription };
