const express = require("express");
const router = express.Router();

//controllers for user route
const {
  signup,
  Login,
  logout,
  ForgotPassword,
  resetPassword,
  refreshTokenRenewal,
} = require("../controller/userController");

//user routes
router.route("/signup").post(signup);
router.route("/login").post(Login);
router.route("/logout").get(logout);
router.route("/Forgot").post(ForgotPassword);
router.route("/:user_id/password/reset/:forgotToken").post(resetPassword);
router.route("/refreshToken").get(refreshTokenRenewal);
//export router

module.exports = router;
