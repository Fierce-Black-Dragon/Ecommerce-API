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
router.route("/myOrder").get(isLoggedIn, getLoggedInUserOrders);
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
router
  .route("/admin/orders")
  .get(isLoggedIn, customRoleChecker(process.env.ADMIN), adminGetAllOrders);
router
  .route("/admin/order/:id")
  .put(
    isLoggedIn,
    customRoleChecker(process.env.ADMIN, process.env.MANAGER),
    adminUpdateOrder
  )
  .delete(isLoggedIn, customRoleChecker(process.env.ADMIN), adminDeleteOrder);

module.exports = router;
