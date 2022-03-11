const express = require("express");
const {
  createShippingAddress,
  getLoggedInUserAddress,
} = require("../controller/shippingAddressController");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authVerify");
//all  routes

router.route("/myAddress").get(isLoggedIn, getLoggedInUserAddress);
router.route("/createAddress").post(isLoggedIn, createShippingAddress);

module.exports = router;
