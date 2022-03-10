const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Razorpay = require("razorpay");

const createError = require("http-errors");

//stripe
exports.fetchStripeKey = async (req, res, next) => {
  res.status(200).json({
    stripe_Key: process.env.STRIPE_API_KEY,
  });
};

exports.captureStripePayment = async (req, res, next) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",

      //optional
      metadata: { integration_check: "accept_a_payment" },
    });

    res.status(200).json({
      success: true,
      amount: req.body.amount,
      client_secret: paymentIntent.client_secret,
      paymentId: paymentIntent.id,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//razorPay
exports.fetchRazorpayKey = async (req, res, next) => {
  try {
    res.status(200).json({
      razorpayKey: process.env.RAZORPAY_API_KEY,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.captureRazorpayPayment = async (req, res, next) => {
  try {
    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    var options = {
      amount: req.body.amount, // amount in the smallest currency unit
      currency: "INR",
    };
    const myOrder = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      amount: req.body.amount,
      order: myOrder,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
