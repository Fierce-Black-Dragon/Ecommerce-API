const express = require("express");
const router = express.Router();
const { testProduct } = require("../controller/productController");

//all home routes
router.route("/testproduct").get(testProduct);

//exports home routes
module.exports = router;
