const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authVerify");
//controllers for user route
const {
  signup,
  Login,
  logout,
  ForgotPassword,
  resetPassword,
  refreshTokenRenewal,
  userDashboard,
  updatePassword,
  updateProfile,
} = require("../controller/userController");

//user routes
router.route("/signup").post(signup);
router.route("/login").post(Login);
router.route("/logout").get(logout);
router.route("/forgot").post(ForgotPassword);
router.route("/:user_id/password/reset/:forgotToken").post(resetPassword);
router.route("/refreshToken").post(refreshTokenRenewal);
router.route("/userDashboard").get(isLoggedIn, userDashboard);
router.route("/userDashboard/update/password").post(isLoggedIn, updatePassword);
router.route("/userDashboard/update/profile").post(isLoggedIn, updateProfile);
// TODO: Add  admin routes in admin can update delete or and user of any role
// TODO: add manager router where he can keep a check on seller and products

//export router

module.exports = router;
