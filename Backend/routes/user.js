const express = require("express");
const { Signup } = require("../controllers/User/signup");
const { VerifyOTP } = require("../controllers/User/verifyOTP");
const { Login } = require("../controllers/User/login");
const { resendOTP } = require("../controllers/User/resendOTP");
const { Logout } = require("../controllers/User/logout");
const { isAuthorized } = require("../middlewares/auth");
const {
  updateUserImage,
  deleteUserImage,
  getUserInfo,
  updateUserInfo,
  getUser,
  getUserStats,
} = require("../controllers/User/userInfo");
const { updateSubscription, getSubscription } = require("../controllers/User/subscription");
const { uploadFile, handleMulterError } = require("../middlewares/multer");

const router = express.Router();

// Auth routes
router.post("/auth/signup", Signup);
router.post("/auth/login", Login);
router.post("/auth/verify", VerifyOTP);
router.get("/auth/resend_otp/:email", resendOTP);
router.get("/auth/logout", isAuthorized, Logout);

// User info routes
router.get("/auth/get-info", isAuthorized, getUserInfo);
router.put("/auth/update-info", isAuthorized, updateUserInfo);
router.get("/auth/get-user", getUser);
router.get("/get-stats", isAuthorized, getUserStats);

// Image upload routes
router.post(
  "/auth/update-image",
  isAuthorized,
  uploadFile,
  handleMulterError,
  updateUserImage
);
router.delete("/auth/delete-image", isAuthorized, deleteUserImage);

// Subscription routes
router.get("/subscription", isAuthorized, getSubscription);
router.put("/subscription", isAuthorized, updateSubscription);

module.exports = router;
