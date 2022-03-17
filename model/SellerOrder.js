const mongoose = require("mongoose");

const sellerOrderSchema = new mongoose.Schema(
  {
    costumer: { type: mongoose.Schema.Types.ObjectID, ref: "User" },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectID, ref: "User" },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("SellerOrder", sellerOrderSchema);
