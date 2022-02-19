const cloudinary = require("cloudinary").v2;
const Product = require("../model/Product");
const createError = require("http-errors");

exports.testProduct = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "test product successfully fetch",
  });
};
exports.createProduct = async (req, res, next) => {
  try {
    //array of  for product images
    const productImageArrays = [];
    // checking if req.file (image is present .)
    if (!req.files) {
      throw createError.BadRequest("products photo are required");
    }
    // if req. files
    if (req.file.photos) {
      const photos = req.file.photos;
      console.log(photos);
      for (let index = 0; index < photos.length; index++) {
        responseImage = await cloudinary.uploader.upload(
          photos[index].tempFilePath,
          {
            folder: "products",
          }
        );

        imageArray.push({
          id: responseImage.public_id,
          secure_url: responseImage.secure_url,
        });
      }
    }
    req.body.photos = imageArray;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
