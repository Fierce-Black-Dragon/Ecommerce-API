const express = require("express");
const router = express.Router();
const { isLoggedIn, customRoleChecker } = require("../middleware/authVerify");
//controllers for user route
const {
  signup,
  Login,
  logout,
  ForgotPassword,
  resetPassword,
  refreshTokenRenewal,
  userDashboard,
  adminGetAllUsers,
  updatePassword,
  updateProfile,
  adminGetAUser,
} = require("../controller/userController");

const { admin, manager, seller, user } = require("../config/roles");
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
// TODO: Add  admin routes in admin can update delete or and user of any role expect other admins
// TODO: add manager router where he can keep a check on seller and products

//admin routes
router
  .route("/admin/allUsers")
  .get(isLoggedIn, customRoleChecker(admin), adminGetAllUsers);
router
  .route("/admin/allUsers/:id")
  .get(isLoggedIn, customRoleChecker(admin), adminGetAUser);

//export router

module.exports = router;
