const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProduct,
  getSellerProducts,
  fetchAProductById,
  sellerUpdateProductByID,
} = require("../controller/productController");
const { admin, manager, seller, user } = require("../config/roles");
const { isLoggedIn, customRoleChecker } = require("../middleware/authVerify");
//all  routes

// fetch all product or fetch search product route
router.route("/products").get(getAllProduct);
router.route("/products/:id").get(fetchAProductById);

////Admin

// product creation route
router
  .route("/createProduct")
  .post(isLoggedIn, customRoleChecker(admin, manager, seller), createProduct);
router
  .route("/seller/Products")
  .get(
    isLoggedIn,
    customRoleChecker(admin, manager, seller),
    getSellerProducts
  );
router
  .route("/seller/Products/:id")
  .put(
    isLoggedIn,
    customRoleChecker(admin, manager, seller),
    sellerUpdateProductByID
  );

//exports home routes
module.exports = router;
