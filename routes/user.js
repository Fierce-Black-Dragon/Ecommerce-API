const express = require("express");
const router = express.Router();

//controllers for user route
const {
  signup,
  Login,
  logout,
  ForgotPassword,
} = require("../controller/userController");

//user routes
router.route("/signup").post(signup);
router.route("/login").post(Login);
router.route("/logout").get(logout);
router.route("/Forgot").post(ForgotPassword);
//export router

module.exports = router;
