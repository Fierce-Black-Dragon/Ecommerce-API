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
      const newShippingPrice =
        existingCart[0].ShippingPrice + foundProduct.ShippingPrice;

      //if the product exist in cart items ..
      if (alreadyCartItem) {
        await Cart.updateOne(
          { user: user, "cartItems.productID": id },
          {
            ShippingPrice: newShippingPrice,
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
        const newShippingPrice =
          existingCart[0].ShippingPrice + foundProduct.ShippingPrice;
        await Cart.updateOne(
          { user: user },
          {
            ShippingPrice: newShippingPrice,
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

//TODO:  CAN DELETE CART IF USER HAS NO ITEMS IN CART
exports.removeCartItems = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = req.user._id;

    const cart = await Cart.find({ user: user }, { cartItems: 1 });
    const foundProduct = await Product.findById(id);
    const newShippingPrice = cart[0].ShippingPrice - foundProduct.ShippingPrice;
    const cartItem = cart[0]?.cartItems.find((el) => {
      return el.productID.toString() === id.toString();
    });
    if (!cartItem) {
      throw createError.BadRequest();
    }
    //if the product qty   is more than ..
    if (cartItem && cartItem?.qty > 1) {
      const newQty = cartItem?.qty - 1;

      await Cart.updateOne(
        { user: user, "cartItems.productID": id },
        {
          ShippingPrice: newShippingPrice,
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
    } else {
      const idToRemove = cartItem._id;

      await Cart.updateOne(
        { user: user },
        {
          $pull: { cartItems: { _id: idToRemove } },
        },
        { new: true }
      ).then((result) => {
        res.status(201).json({ message: "  You have removed" });
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.loggedInUSerCart = async (req, res, next) => {
  try {
    const user = req.user._id;
    const cart = await Cart.find({ user: user });
    if (cart[0]?.cartItems.length === 0) {
      throw createError.NotFound(" product not be found");
    } else {
      const cartItemsTotalPrices = cart[0]?.cartItems.map((p) => p.totalPrice);
      const totalPrice = cartItemsTotalPrices?.reduce((a, b) => a + b, 0);

      const grandtotalPrice = cart.ShippingPrice + totalPrice;
      console.log(cart, totalPrice);
      // await Cart.updateOne(
      //   { user: user },
      //   {
      //     $set: {
      //       grandtotalPrice: grandtotalPrice,
      //     },
      //   }
      // );

      await Cart.find({ user: user }).then((result) => {
        res.status(201).json(result);
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
