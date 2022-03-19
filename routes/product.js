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
  .post(
    isLoggedIn,
    customRoleChecker(
      process.env.ADMIN,
      process.env.MANAGER,
      process.env.SELLER
    ),
    createProduct
  );
router
  .route("/seller/Products")
  .get(
    isLoggedIn,
    customRoleChecker(
      process.env.ADMIN,
      process.env.MANAGER,
      process.env.SELLER
    ),
    getSellerProducts
  );
router
  .route("/seller/Products/:id")
  .put(
    isLoggedIn,
    customRoleChecker(
      process.env.ADMIN,
      process.env.MANAGER,
      process.env.SELLER
    ),
    sellerUpdateProductByID
  )
  .delete(
    isLoggedIn,
    customRoleChecker(
      process.env.ADMIN,
      process.env.MANAGER,
      process.env.SELLER
    ),
    sellerDeleteProductByID
  );

//exports  routes
module.exports = router;
