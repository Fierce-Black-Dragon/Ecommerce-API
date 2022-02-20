const express = require("express");
const router = express.Router();
const { createCategory } = require("../controller/categoryController");

//all category  routes
router.route("/createC").post(createCategory);
//TODO: get categories route

//exports home routes
module.exports = router;
