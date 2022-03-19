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
  adminDeleteAUser,
  adminPromoteOrDe_PromoteAUser,
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
  .get(isLoggedIn, customRoleChecker(process.env.ADMIN), adminGetAllUsers);
router
  .route("/admin/allUsers/:id")
  .get(isLoggedIn, customRoleChecker(process.env.ADMIN), adminGetAUser);
router
  .route("/admin/allUsers/:id")
  .post(
    isLoggedIn,
    customRoleChecker(process.env.ADMIN),
    adminPromoteOrDe_PromoteAUser
  );
router
  .route("/admin/allUsers/:id")
  .delete(isLoggedIn, customRoleChecker(process.env.ADMIN), adminDeleteAUser);
//export router

module.exports = router;
