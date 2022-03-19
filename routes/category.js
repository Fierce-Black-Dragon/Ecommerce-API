const express = require("express");
const router = express.Router();
const { createCategory } = require("../controller/categoryController");
const { isLoggedIn, customRoleChecker } = require("../middleware/authVerify");
const { admin, manager, seller, user } = require("../config/roles");
//all category  routes
router
  .route("/createC")
  .post(
    isLoggedIn,
    customRoleChecker(process.env.ADMIN, process.env.MANAGER),
    createCategory
  );
//TODO: get categories route

//exports home routes
module.exports = router;
