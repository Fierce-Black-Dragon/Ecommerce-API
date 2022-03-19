const Order = require("../model/Orders");
const SellerOrder = require("..//model/SellerOrder");
const createError = require("http-errors");
const Product = require("../model/Product");
const ShippingAddress = require("../model/ShippingAddress");
const mailHelper = require("../utils/NodeMailer");
const Cart = require("../model/Cart");
exports.placeOrder = async (req, res, next) => {
  try {
    const user = req.user._id;
    const { shippingAddressId, paymentMethod, paymentInfo, isPaid, paidAt } =
      req.body;
    if (!(shippingAddressId && paymentMethod && paymentInfo)) {
      throw createError.BadRequest();
    }
    const loggedInUserAddress = await ShippingAddress.findById(
      shippingAddressId
    );

    if (!loggedInUserAddress) {
      throw createError.NotFound("invalid user address");
    }
    const userCart = await Cart.find({ user: user });

    //if cart is empty logic
    if (userCart.length === 0) {
      throw createError.NotFound("cart is empty");
    }

    const cartItems = userCart[0]?.cartItems?.map((p) => p);
    const shippingPrice = userCart[0]?.ShippingPrice;

    await Order.create({
      orderItems: userCart[0]?.cartItems,
      shippingInfo: {
        fullName: loggedInUserAddress.fullName,
        address: loggedInUserAddress.address,
        city: loggedInUserAddress.city,
        postalCode: loggedInUserAddress.postalCode,
        country: loggedInUserAddress.country,
        state: loggedInUserAddress.state,
        phoneNo: loggedInUserAddress.phoneNo,
      },
      paymentMethod: paymentMethod,
      shippingAmount: shippingPrice,
      paymentInfo: paymentInfo,
      totalAmount: userCart[0]?.grandtotalPrice,
      user: user,
    }).then(async (result) => {
      cartItems?.forEach(async (product) => {
        await SellerOrder.create({
          costumer: user,
          productID: product.productID,
          name: product.name,
          seller: product.user,

          price: product.price,
          qty: product.qty,
        });

        const productToChange = await Product.findById(product.productID);
        let newStock = parseInt(productToChange.stock) - product.qty;
        await Product.findByIdAndUpdate(
          productToChange._id,
          {
            stock: newStock,
          },
          {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          }
        );
      });

      await Cart.findOneAndDelete({ user: user });

      // craft a message
      const message = `order with id #${result._id}  has been successfully  placed`;

      //attempt to send email with nodemailer
      //try catch
      try {
        await mailHelper({
          email: req.user.email,
          subject: `order  placed`,
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

exports.getLoggedInSellerOrderList = async (req, res, next) => {
  try {
    const user = req.user._id;
    await SellerOrder.find({ seller: user }).then((result) => {
      res.status(201).json(result);
    });
  } catch (err) {
    next(err);
  }
};
