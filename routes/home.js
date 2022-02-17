const express = require("express");
const router = express.Router();
const { home } = require("../controller/homeController");

//all home routes
router.route("/").get(home);

//exports home routes
module.exports = router;
