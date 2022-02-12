const express = require("express");
const router = express.Router();
const { home } = require("../controller/homeController");
const { isLoggedIn } = require("../middleware/authVerify");
//all home routes
router.route("/").get(isLoggedIn, home);

//exports home routes
module.exports = router;
