const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getLoggedInUserOrders,
  adminGetAllOrders,
  adminUpdateOrder,
  getLoggedInSellerOrderList,
  adminDeleteOrder,
} = require("../controller/orderController");
const { isLoggedIn, customRoleChecker } = require("../middleware/authVerify");
router.route("/placeOrder").post(isLoggedIn, placeOrder);
router
  .route("/sellerOrder")
  .get(
    isLoggedIn,
    customRoleChecker(
      process.env.ADMIN,
      process.env.MANAGER,
      process.env.SELLER
    ),
    getLoggedInSellerOrderList
  );
router.route("/myOrder").get(isLoggedIn, getLoggedInUserOrders);
module.exports = router;
