const ShippingAddress = require("../model/ShippingAddress");
const createError = require("http-errors");
exports.createShippingAddress = async (req, res, next) => {
  try {
    const { fullName, address, city, postalCode, country, phoneNo, state } =
      req.body;
    if (!(fullName && address && city && postalCode && country && phoneNo)) {
      throw createError.BadRequest(" all felids required");
    }
    const Createdaddress = await ShippingAddress.create({
      user: req.user._id,
      fullName,
      address,
      city,
      postalCode,
      country,
      phoneNo,
      state,
    });
    res.status(201).json({
      success: true,
      message: "ShippingAddress added successfully",
      ShippingAddress: Createdaddress,
    });
  } catch (error) {
    next(error);
  }
};

exports.getLoggedInUserAddress = async (req, res) => {
  try {
    const user = req.user._id;

    const UserAddress = await ShippingAddress.find({ user: user });
    res.status(200).json({
      MyAddress: UserAddress,
    });
  } catch (error) {
    next(error);
  }
};
