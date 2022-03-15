const express = require("express");
const router = express.Router();
const {
  addCartItems,
  removeCartItems,
} = require("../controller/cartController");
const { isLoggedIn, customRoleChecker } = require("../middleware/authVerify");
router.route("/addToCart/product/:id").post(isLoggedIn, addCartItems);
router.route("/remove/product/:id").get(isLoggedIn, removeCartItems);
module.exports = router;
