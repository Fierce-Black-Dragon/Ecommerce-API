const express = require('express');
require('dotenv').config();

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