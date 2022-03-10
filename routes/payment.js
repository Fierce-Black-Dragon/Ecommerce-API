const express = require("express");
const {
  fetchStripeKey,
  captureStripePayment,
} = require("../controller/paymentController");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authVerify");
//all  routes

router.route("/fetchStripe").get(isLoggedIn, fetchStripeKey);
router.route("/stripe").post(isLoggedIn, captureStripePayment);

module.exports = router;
