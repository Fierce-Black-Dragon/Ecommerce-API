const mongoose = require("mongoose");

// price
// description
// photos[]
// category
// Brand
// stock
// numberOFreviews
// rating
// reviews[user,name, rating,comment]
// user(productCReator (ref))

//review schema
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide product name"],
      trim: true,
      maxlength: [120, "Product name should not be more than 120 characters"],
    },
    price: {
      type: Number,
      required: [true, "please provide product price"],
      maxlength: [6, "Product price should not be more than 6 digits"],
    },
    description: {
      type: String,
      required: [true, "please provide product description"],
    },
    photos: [
      {
        id: {
          type: String,
          required: true,
        },
        secure_url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [
        true,
        "please select category from- short-sleeves, long-sleeves, sweat-shirts, hoodies",
      ],
      enum: {
        values: ["shortsleeves", "longsleeves", "sweatshirt", "hoodies"],
        message:
          "please select category ONLY from - short-sleeves, long-sleeves, sweat-shirts and hoodies ",
      },
    },
    //this field was updated in order videos later
    stock: {
      type: Number,
      required: [true, "please add a number in stock"],
    },
    brand: {
      type: String,
      required: [true, "please add a brand for clothing"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);