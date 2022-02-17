const jwt = require("jsonwebtoken");
const User = require("../model/User");
const createError = require("http-errors");

exports.isLoggedIn = async (req, res, next) => {
  try {
    // storing token from  req header
    const token = req?.header("Authorization")?.replace("Bearer ", "");
    // if token is not present
    if (!token) {
      return next(createError.Unauthorized());
    }
    //verifying access token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
    //injecting user information in req
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    next(error);
  }
};
exports.customRoleChecker = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new CustomError("You are not allowed for this resouce", 403));
    }
    next();
  };
};
