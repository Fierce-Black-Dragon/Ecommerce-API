const ShippingAddress = require("../model/ShippingAddress");
const createError = require("http-errors");
exports.createShippingAddress = async (req, res, next) => {
  try {
    const { fullName, addressLine, city, postalCode, country, contact_no } =
      req.body;
    if (
      !(fullName && addressLine && city && postalCode && country && contact_no)
    ) {
      throw createError.BadRequest(" all felids required");
    }
    const address = await ShippingAddress.create({
      user: req.user._id,
      fullName,
      addressLine,
      city,
      postalCode,
      country,
      contact_no,
    });
    res.status(201).json({
      success: true,
      message: "ShippingAddress added successfully",
      ShippingAddress: address,
    });
  } catch (error) {
    next(error);
  }
};

export const getLoggedInUserAddress = async (req, res) => {
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
