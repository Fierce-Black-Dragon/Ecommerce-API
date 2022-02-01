const express = require("express");
const router = express.Router();

//controllers for user route
const { signup, Login, logout } = require("../controller/userController");

//user routes
router.route("/signup").post(signup);
router.route("/login").post(Login);
router.route("/logout").get(logout);

//export router

module.exports = router;
