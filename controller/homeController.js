exports.home = (req, res) => {
  try {
    res.status(200).json({
      Success: true,
      message: "Welcome to  ecomm api ",
    });
  } catch (e) {
    console.log(e);
  }
};
