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

      //if the product exist in cart items ..
      if (alreadyCartItem) {
        await Cart.updateOne(
          { user: user, "cartItems.productID": id },
          {
            $set: {
              "cartItems.$.qty": newQty,
              //calculating  total price
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
      //if it doesn't
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

export const removeCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = req.user._id;

    const cart = await Cart.find({ user: user }, { cartItems: 1 });

    const cartItem = cart[0]?.cartItems.find((el) => {
      return el.productID.toString() === id.toString();
    });

    //if the product qty   is more than ..
    if (cartItem && cartItem?.qty > 1) {
      const newQty = cartItem?.qty - 1;
      await Cart.updateOne(
        { user: user, "cartItems.productID": id },
        {
          $set: {
            "cartItems.$.qty": newQty,
            //calculating  total price
            "cartItems.$.totalPrice": cartItem.totalPrice - cartItem.price,
          },
        }
      ).then((result) => {
        res.status(201).json({
          success: true,
          message: "product removed  from cart",
        });
      });
    }

    var filtered = cartItems.filter(function (el) {
      return el.productID == id;
    });

    const idToRemove = filtered[0]?._id;

    await Cart.updateOne(
      { user: user },
      { $pull: { cartItems: { _id: idToRemove } } },
      { new: true }
    ).then((result) => {
      res.status(201).json({ message: "  You have removed" });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
