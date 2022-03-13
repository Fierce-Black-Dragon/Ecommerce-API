const Cart = require("../model/Cart");
const createError = require("http-errors");
const Product = require("../model/Product");

exports.addCartItems = async (req, res, next) => {
  try {
    const { id } = req.params;
    const defaultQty = req.body.Qty || 1;
    const user = req.user._id;
    const existingCart = await Cart.find({ user: user }); //find() returns a list
    if (!id) {
      throw createError.NotFound(" product not be found");
    }
    const foundProduct = await Product.findById(id);

    const totalPrice = foundProduct.price * defaultQty;
    //product
    let productToAdd = {
      productID: foundProduct._id,
      name: foundProduct.name,
      seller: foundProduct.user,
      image: foundProduct.photos[0].secure_url,
      price: foundProduct.price,
      qty: defaultQty,
      totalPrice: totalPrice,
    };

    // if user has no item in cart it create a new cart  with product details
    if (existingCart.length === 0) {
      const ShippingPrice = foundProduct.ShippingPrice;

      const newCart = await Cart.create({
        user: user,
        cartItems: productToAdd,
        ShippingPrice,
      });

      res.status(201).json({
        success: true,
        message: "product added to cart",
      });
    }
    // if user has  products added to cart
    else {
      const alreadyCartItem = existingCart[0]?.cartItems.find((el) => {
        return el.productID.toString() === id.toString();
      });
      const newQty = alreadyCartItem?.qty + 1;
      //calculating  total price
      productToAdd.totalPrice = productToAdd.price * newQty;
      //if the product exist in cart items ..
      if (alreadyCartItem) {
        await Cart.updateOne(
          { user: user, "cartItems.productID": id },
          {
            $set: {
              "cartItems.$.qty": newQty,
              "cartItems.$.totalPrice": productToAdd.price * newQty,
            },
          }
        ).then((result) => {
          res.status(201).json({
            success: true,
            message: "product added to cart",
          });
        });
      }
      //if it doesnt
      else if (!alreadyCartItem) {
        await Cart.updateOne(
          { user: user },
          {
            $push: {
              cartItems: productToAdd,
            },
          }
        ).then((result) => {
          res.status(201).json({
            success: true,
            message: "product added to cart",
          });
        });
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
