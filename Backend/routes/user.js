const express = require("express");
const { Signup } = require("../controllers/User/signup");
const { VerifyOTP } = require("../controllers/User/verifyOTP");
const { Login } = require("../controllers/User/login");
const { resendOTP } = require("../controllers/User/resendOTP");
const { Logout } = require("../controllers/User/logout");
const { isAuthorized } = require("../middlewares/auth");
const { updateUserImage, deleteUserImage, getUserInfo, updateUserInfo, getUser, getUserStats } = require("../controllers/User/userInfo");
const { uploadFile } = require("../middlewares/multer");
const router = express.Router();

router.post("/auth/signup", Signup);
router.post("/auth/login", Login);
router.post("/auth/verify", VerifyOTP);
router.get("/auth/resend_otp/:email", resendOTP);
router.get("/auth/logout", isAuthorized, Logout);
router.post("/auth/update-image", isAuthorized, uploadFile, updateUserImage);
router.delete("/auth/delete-image", isAuthorized, deleteUserImage);
router.get("/auth/get-info", isAuthorized, getUserInfo);
router.put("/auth/update-info", isAuthorized, updateUserInfo);
router.get("/auth/get-user", getUser);
router.get("/get-stats",isAuthorized,getUserStats);

module.exports = router;
