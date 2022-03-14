const express = require("express");
const router = express.Router();
const {
  addCartItems,
  removeCartItem,
} = require("../controller/cartController");
const { isLoggedIn, customRoleChecker } = require("../middleware/authVerify");
router.route("/addToCart/product/:id").post(isLoggedIn, addCartItems);
router.route("/addToCart/product/:id").get(isLoggedIn, removeCartItem);
module.exports = router;
