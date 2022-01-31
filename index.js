const app = require("./app");
const connectionWithDB = require("./config/database");
require("dotenv").config();
const cloudinary = require("cloudinary");
const PORT = process.env.PORT || 4000;

// db connection
connectionWithDB();

// cloudinary connection
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET_KEY,
  secure: true,
});

// server start
app.listen(PORT, (req, res) => {
  console.log(
    `Server started listening on port :- ${PORT}   ............!!!!!!`
  );
});
