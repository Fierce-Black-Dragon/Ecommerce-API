require("dotenv").config();
//git push -u origin main
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
var morgan = require("morgan");
const app = express();
const home = require("./routes/home");
const user = require("./routes/user");

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

// export app
module.exports = app;
