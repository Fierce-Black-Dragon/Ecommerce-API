const Category = require("../model/Category");
const createError = require("http-errors");
exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw createError.BadRequest(" category name is required");
    }
    const categoryR = await Category.create({
      name: name,
    });
    res.status(201).json({
      success: true,
      message: "category created successfully",
      categoryDetails: categoryR,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
