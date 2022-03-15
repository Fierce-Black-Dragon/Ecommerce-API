const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectID, ref: "User" },

  cartItems: [
    {
      productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String, required: true },
      seller: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "User",
        required: true,
      },

      price: { type: Number, required: true },
      qty: { type: Number, default: 1, required: true },

      totalPrice: { type: Number, default: 0, required: true },
    },
  ],
  ShippingPrice: { type: Number, default: 0, required: true },
  grandtotalPrice: { type: Number, default: 0, required: true },
});
module.exports = mongoose.model("Cart", cartSchema);
