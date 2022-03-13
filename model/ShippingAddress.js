const mongoose = require("mongoose");

const shippingAddressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fullName: { type: String },
  address: { type: String },
  city: { type: String },
  postalCode: { type: String },
  country: { type: String },
  contact_no: { type: Number },
});
module.exports = module.exports = mongoose.model(
  "ShippingAddress",
  shippingAddressSchema
);
