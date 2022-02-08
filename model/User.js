const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [40, " max 40 character"],
  },
  email: {
    type: String,
    required: [true, "Please enter the email address"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
    minlength: [6, "Please enter password greater than or equal to 6 char"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  profilePhoto: {
    id: {
      type: String,
      required: true,
    },
    secured_Url: {
      type: String,
      required: true,
    },
  },
  forgotPasswordToken: String,
  forgotTokenExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // more fields will be added when required
});

//encrypt password before save -- mongoose Hook
userSchema.pre("save", async function (next) {
  //to prevent over-encryption of password
  if (!this.isModified("password")) {
    return next();
  }
  //encrypt
  this.password = await bcrypt.hash(this.password, 10);
});
// Mongoose Methods
//user password validate method
userSchema.methods.isPasswordValid = async function (senderPassword) {
  return await bcrypt.compare(senderPassword, this.password);
};

// jwt  creation
userSchema.methods.jwtTokenCreation = async function () {
  return await jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// forgot password token creation
userSchema.methods.getForgotPasswordToken = async function () {
  //forgot password token creation -(type - String)
  const forgotToken = await crypto.randomBytes(20).toString("hex"); // dont know how much time will  take
  //expire
  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
 
  // save hash version of the token in the database  and send the forgot password token  to user
  this.forgotPasswordToken = await crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  return forgotToken;
};
module.exports = mongoose.model("User", userSchema);
