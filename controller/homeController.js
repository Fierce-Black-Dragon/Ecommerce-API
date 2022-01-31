exports.home = (req, res) => {
  res.status(200).json({
    Success: true,
    message: "Welcome to  ecomm api ",
  });
};
