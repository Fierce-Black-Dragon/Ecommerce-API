const express = require("express");
const {
  fetchStripeKey,
  captureStripePayment,
  fetchRazorpayKey,
  captureRazorpayPayment,
} = require("../controller/paymentController");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authVerify");
//all  routes

// router.route("/fetchStripe").get(isLoggedIn, fetchStripeKey);
router.route("/stripe").post(isLoggedIn, captureStripePayment);

// router.route("/fetchRazorPay").get(isLoggedIn, fetchRazorpayKey);
router.route("/razorPay").post(isLoggedIn, captureRazorpayPayment);
module.exports = router;
