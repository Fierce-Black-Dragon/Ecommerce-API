const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProduct,
} = require("../controller/productController");
const { admin, manager, seller, user } = require("../config/roles");
const { isLoggedIn, customRoleChecker } = require("../middleware/authVerify");
//all  routes

// fetch all product or fetch search product route
router.route("/products").get(getAllProduct);

////Admin

// product creation route
router
  .route("/createProduct")
  .post(isLoggedIn, customRoleChecker(admin, manager, seller), createProduct);
//exports home routes
module.exports = router;
