const cloudinary = require("cloudinary").v2;
const Product = require("../model/Product");
const createError = require("http-errors");
const Category = require("../model/Category");

//create product
exports.createProduct = async (req, res, next) => {
  try {
    // getting the require data from req.body
    const { name, price, description, category, stock, brand } = req.body;

    //if any fields are missing
    if (!(name && price && description && category && stock && brand)) {
      throw createError.BadRequest("all fields  are required");
    }
    //array of  for product images
    const productImageArrays = [];
    // checking if req.file (image is present .)
    if (!req.files) {
      throw createError.BadRequest("products photo are required");
    }

    // if req. files
    if (req.files.photos) {
      for (let index = 0; index < req.files.photos.length; index++) {
        responseImage = await cloudinary.uploader.upload(
          req.files.photos[index].tempFilePath,
          {
            folder: "products",
          }
        );

        productImageArrays.push({
          id: responseImage.public_id,
          secure_url: responseImage.secure_url,
        });
      }
    }

    const ifCategoryExists = await Category.findById(category);
    if (!ifCategoryExists) {
      throw createError.NotFound("unknown category received");
    }

    const product = await Product.create({
      name: name,
      price: price,
      description: description,
      category: category,
      stock: stock,
      brand: brand,
      photos: productImageArrays,
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
