const cloudinary = require("cloudinary").v2;
const Product = require("../model/Product");
const createError = require("http-errors");
const Category = require("../model/Category");
const WhereClause = require("../utils/WhereClause");
const UserModel = require("../model/User");
//create product
exports.createProduct = async (req, res, next) => {
  try {
    // getting the require data from req.body
    const { name, price, description, category, stock, brand } = req.body;
    const userId = req.user._id;

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

    const saveProductId = await UserModel.updateOne(
      { _id: userId },
      {
        $push: {
          sellerProducts: product._id,
        },
      }
    );
    console.log(saveProductId);
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getAllProduct = async (req, res, next) => {
  try {
    const resultPerPage = 6;
    const totalCountProduct = await Product.countDocuments();

    const productsObj = new WhereClause(Product.find(), req.query)
      .search()
      .filter();

    let products = await productsObj.base;
    const filteredProductNumber = products.length;

    //products.limit().skip()

    productsObj.pager(resultPerPage);
    products = await productsObj.base.clone();

    res.status(200).json({
      success: true,
      products,
      filteredProductNumber,
      totalCountProduct,
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchAProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productDetails = await Product.findById(id);
    res.status(200).json({
      success: true.valueOf,
      productDetails,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    //TODO: check if user is verified buyer of this product
    const { rating, comment } = req.body;
    const { id } = req.params;
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(id);

    const AlreadyReview = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (AlreadyReview) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user._id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    } else {
      product.reviews.push(review);
      product.numberOfReviews = product.reviews.length;
    }

    // adjust ratings

    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    //save

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    const reviews = product.reviews.filter(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
    const numberOfReviews = reviews.length;

    // adjust ratings
    product.numberOfReviews = numberOfReviews;
    product.ratings =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    //save

    await Product.findByIdAndUpdate(
      id,
      {
        reviews,
        ratings,
        numberOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getSellerProducts = async (req, res, next) => {
  try {
    const id = req.user._id;
    const products = await Product.find({ user: id });
    if (!products) {
      throw createError.NotFound(" product cant be found");
    }
    res.status(200).json({
      success: true.valueOf,
      products,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//admin seller
exports.sellerUpdateProductByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sellerId = req.user._id;
    const sellerProduct = req.user.sellerProducts;

    //if any fields are missing

    const isFound = sellerProduct.some((element) => {
      if (element.toString() === id) {
        return true;
      }
    });

    if (!isFound) {
      throw createError.Unauthorized(
        "ur not authorized to change this product"
      );
    }
    let product = await Product.findById(id);

    if (!product) {
      return next(new CustomError("No product found with this id", 401));
    }
    let imagesArray = [];

    if (req.files) {
      //destroy the existing image
      for (let index = 0; index < product.photos.length; index++) {
        const res = await cloudinary.v2.uploader.destroy(
          product.photos[index].id
        );
      }

      for (let index = 0; index < req.files.photos.length; index++) {
        let result = await cloudinary.v2.uploader.upload(
          req.files.photos[index].tempFilePath,
          {
            folder: "products", //folder name -> .env
          }
        );

        imagesArray.push({
          id: result.public_id,
          secure_url: result.secure_url,
        });
      }
    }

    req.body.photos = imagesArray;

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
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

exports.sellerDeleteProductByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sellerId = req.user._id;
    const sellerProduct = req.user.sellerProducts;

    const isFound = sellerProduct.some((element) => {
      if (element.toString() === id) {
        return true;
      }
    });

    if (!isFound) {
      throw createError.Unauthorized(
        "ur not authorized to change this product"
      );
    }

    //destroy the existing image
    for (let index = 0; index < product.photos.length; index++) {
      const res = await cloudinary.v2.uploader.destroy(
        product.photos[index].id
      );
    }

    await product.remove();

    res.status(200).json({
      success: true,
      message: "Product was deleted !",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
