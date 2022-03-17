const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getLoggedInUserOrders,
} = require("../controller/orderController");
const { isLoggedIn, customRoleChecker } = require("../middleware/authVerify");
router.route("/placeOrder").post(isLoggedIn, placeOrder);
// router.route("/sellerOrder").get(isLoggedIn);
router.route("/myOrder").get(isLoggedIn, getLoggedInUserOrders);
module.exports = router;
