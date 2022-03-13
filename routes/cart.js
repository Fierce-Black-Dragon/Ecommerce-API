const express = require("express");
const router = express.Router();
const { addCartItems } = require("../controller/cartController");
const { isLoggedIn, customRoleChecker } = require("../middleware/authVerify");
router.route("/addToCart/product/:id").post(isLoggedIn, addCartItems);
module.exports = router;
