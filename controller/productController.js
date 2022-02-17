exports.testProduct = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "test product successfully fetch",
  });
};
