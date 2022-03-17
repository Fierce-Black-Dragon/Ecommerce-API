import ShippingAddress from "../model/ShippingAddress";

const Order = require("../model/Orders");
const SellerOrder = require("..//model/SellerOrder");
const createError = require("http-errors");
const ShippingAddress = require("../model/ShippingAddress");
const mailHelper = require("../utils/NodeMailer");
exports.placeOrder = async (req, res, next) => {
  try {
    const user = req.user._id;
    const { shippingAddressId, paymentMethod, paymentResult, isPaid, paidAt } =
      req.body;
    if (!(shippingAddressId && paymentMethod && paymentResult)) {
      throw createError.BadRequest();
    }
    const loggedInUSerAddress = await ShippingAddress.findById(
      shippingAddressId
    );
    if (!loggedInUSerAddress) {
      throw createError.NotFound("invalid user address");
    }
    const userCart = await Cart.find({ user: user });
    //if cart is empty logic
    if (!userCart) {
      throw createError.NotFound("cart is empty");
    }

    const shippingPrice = userCart[0]?.ShippingPrice;

    const cartItems = userCart[0]?.cartItems?.map((p) => p);

    await Order.create({
      orderItems: cartItems,
      shippingAddress: {
        fullName: loggedInUSerAddress.fullName,
        address: loggedInUSerAddress.address,
        city: loggedInUSerAddress.city,
        postalCode: loggedInUSerAddress.postalCode,
        country: loggedInUSerAddress.country,
        state: loggedInUSerAddress.state,
        phoneNo: loggedInUSerAddress.phoneNo,
      },
      paymentMethod: paymentMethod,
      shippingAmount: shippingPrice,
      paymentInfo: paymentResult,
      totalAmount: userCart[0]?.grandtotalPrice,
      user: user,

      isPaid: isPaid,
    }).then((result) => {
      cartItems?.forEach((product) => {
        await SellerOrder.create({
          costumer: user,
          productID: product.productID,
          name: product.name,
          seller: product.user,
          image: product.photos[0].secure_url,
          price: product.price,
          qty: product.qty,
        });
      });
      await Cart.findOneAndDelete({ user: user });

      // craft a message
      const message = result;
      //attempt to send email with nodemailer
      //try catch
      try {
        await mailHelper({
          email: req.user.email,
          subject: `order with id #${result._id} i=has been successfully placed`,
          message: message,
        });
      } catch (error) {
        console.log(error);
        next(error);
      }
      res.json({ message: "order is placed and cart is empty now." });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getLoggedInUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    if (!orders) {
      throw createError.NotFound(" No orders ");
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
