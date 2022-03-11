require("dotenv").config();
//git push -u origin main
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
var morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();
const createError = require("http-errors");

//routes
const home = require("./routes/home");
const user = require("./routes/user");
const product = require("./routes/product");
const category = require("./routes/category");
const payment = require("./routes/payment");
const shippingAddress = require("./routes/shippingAddress");

//redis connection
require("./config/redisDB");

//cors middleware
app.use(cors());

//morgan
app.use(morgan("dev"));
//for swagger documentation
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//regular middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
//router middleware
app.use("/api/v1", home);
app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", category);
app.use("/api/v1", payment);
app.use("/api/v1", shippingAddress);

//404(route not found) handler and pass to error handler
app.use(async (req, res, next) => {
  next(createError.NotFound());
});
//Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
// export app
module.exports = app;
