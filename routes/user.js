const express = require('express')
const router = express.Router();

//controllers for user route
const {signup,Login}= require('../controller/userController')



//user routes
router.route('/signup').post(signup);
router.route('/login').post(Login);





//export router


module.exports = router

