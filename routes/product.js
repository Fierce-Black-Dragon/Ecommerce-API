const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProduct,
  getSellerProducts,
  fetchAProductById,
  sellerUpdateProductByID,
  sellerDeleteProductByID,
  addReview,
  deleteReview,
} = require("../controller/productController");
const { admin, manager, seller, user } = require("../config/roles");
const { isLoggedIn, customRoleChecker } = require("../middleware/authVerify");
//all  routes

// fetch all product or fetch search product route
router.route("/products").get(getAllProduct);
router.route("/products/:id").get(fetchAProductById);
router
  .route("/products/:id/review")
  .put(isLoggedIn, addReview)
  .delete(isLoggedIn, deleteReview);

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
  )
  .delete(
    isLoggedIn,
    customRoleChecker(admin, manager, seller),
    sellerDeleteProductByID
  );

//exports home routes
module.exports = router;
