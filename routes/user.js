const express = require('express')
const router = express.Router();

//controllers for user route
const {signup}= require('../controller/userController')



//user routes
router.route('/signup').post(signup);






//export router


module.exports = router

