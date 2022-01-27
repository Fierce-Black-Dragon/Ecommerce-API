require('dotenv').config()
const express = require('express');
//database connection
require('./config/database').connect()


const app = express();
const home = require('./routes/home')
const user = require('./routes/user')




//regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//router middleware
app.use("/api/v1", home);
app.use("/api/v1", user)







// export app
module.exports = app;