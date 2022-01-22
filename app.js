const express = require('express');
require('dotenv').config();

const app = express();
const home= require('./routes/home')
//app routes middle ware

app.use('/api/v1', home);








// export app
module.exports = app;