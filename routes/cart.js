const express = require("express");
const router = express.Router();
const {
  addCartItems,
  removeCartItems,
  loggedInUSerCart,
} = require("../controller/cartController");
const { isLoggedIn, customRoleChecker } = require("../middleware/authVerify");
router.route("/addToCart/product/:id").post(isLoggedIn, addCartItems);
router.route("/remove/product/:id").post(isLoggedIn, removeCartItems);
router.route("/myCart").get(isLoggedIn, loggedInUSerCart);
module.exports = router;
