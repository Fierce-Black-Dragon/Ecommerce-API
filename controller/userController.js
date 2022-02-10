const UserModel = require("../model/User");
const cookieToken = require("../utils/CookieToken");
const cloudinary = require("cloudinary").v2;
const mailHelper = require("../utils/NodeMailer");
const crypto = require("crypto");
const createError = require("http-errors");
const {
  authLSchema,
  authRSchema,
  resetPasswordSchema,
  forgotSchema,
} = require("../utils/schemaValidator");
exports.signup = async (req, res, next) => {
  try {
    //
    let responseImage;
    //validate the  user input (checking if all fields are enter correctly)
    const validateResult = await authRSchema.validateAsync(req.body);
    const { name, email, password, role } = validateResult;

    // checking if file is send
    if (!req.files) {
      throw createError.NotFound(" profileImage is missing");
    }
    const file = req.files.profile;

    if (file.tempFilePath) {
      responseImage = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "users",
        width: 150,
        crop: "scale",
      });
    }

    //finding if user is already register
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      throw createError.Conflict(`${result.email} is already been registered`);
    }
    //creating user in mongo db
    const user = await UserModel.create({
      name,
      email,
      password,
      profilePhoto: {
        id: responseImage.public_id,
        secured_Url: responseImage.secure_url,
      },
    });
    // send json response with register successfully
    res.status(201).json({
      success: true,
      message: "Register successfully u can login now",
    });
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 422;
      error.message =
        " all fields are required or invalid  fields values passed";
    }
    next(error);
  }
};

exports.Login = async (req, res, next) => {
  try {
    //validate the  user input (checking if all fields are enter correctly)
    const validateResult = await authLSchema.validateAsync(req.body);
    const { email, password } = validateResult;

    //finding the user in database  using email
    const user = await UserModel.findOne({ email }).select("+password");
    //if user is not found
    if (!user) {
      throw createError.NotFound("User not found");
    }
    // checking  if enter password is correct
    const isPAsswordCorrect = await user.isPasswordValid(password);
    if (!isPAsswordCorrect) {
      throw createError.Unauthorized("email or password invalid");
    }

    //token creation function
    cookieToken(user, res);
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 400;
      error.message = "email or password invalid";
    }
    next(error);
  }
};

// log out user
exports.logout = async (req, res, next) => {
  try {
    //making the cookie expiry  options
    const options = {
      expires: new Date(Date.now()),
      httpOnly: true,
    };

    //setting cookie to null when logout route is requested
    res.status(200).cookie("auth_token", null, options).json({
      success: true,
      message: "logout success",
    });
  } catch (error) {
    next(error);
  }
};
//forgot password token
exports.ForgotPassword = async (req, res, next) => {
  try {
    //checking if  email enter is actually a email
    const validateResult = await forgotSchema.validateAsync(req.body);

    const { email } = validateResult;
    //checking if email is send

    const user = await UserModel.findOne({ email });
    //checking if user with this email is register  in our database
    if (!user) {
      throw createError.NotFound("User not found");
    }
    //creating forgot password token
    const forgotToken = await user.getForgotPasswordToken();
    // saving the token in the database
    await user.save({ validateBeforeSave: false });
    //create a URL
    const myUrl = `http://localhost:3000/${user._id}/password/reset/${forgotToken}`;

    // craft a message
    const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl}`;
    //attempt to send email with nodemailer
    //try catch
    try {
      await mailHelper({
        email: user.email,
        subject: "Store - password reset",
        message: message,
      });
      res.status(200).json({
        succes: true,
        message: "Email sent successfully",
      });
    } catch (error) {
      //if  sending email failed  resetting the token to null
      user.forgotPasswordToken = undefined;
      user.forgotTokenExpiry = undefined;
      // saving in the database
      await user.save({ validateBeforeSave: false });
      console.log(error);
    }
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 422;
      error.message = "  invalid   email";
    }
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { user_id, forgotToken } = req.params;
    const validateResult = await resetPasswordSchema.validateAsync(req.body);

    const { password, confirmPassword } = validateResult;

    const encryToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex");

    // find user based on based on  token and time in future
    const user = await UserModel.findOne({
      forgotPasswordToken: encryToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw createError.Unauthorized("Token is invalid or expired");
    }

    // check if password and conf password matched
    if (password !== confirmPassword) {
      throw createError.BadRequest(
        "password and confirm password do not match"
      );
    }

    // update password field in DB
    user.password = password;

    // reset token fields
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    // save the user
    await user.save();

    // send a JSON response

    res.status(200).json({ message: " reset successfully" });
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 422;
      error.message =
        " all fields are required or invalid  fields values passed";
    }
    next(error);
  }
};
