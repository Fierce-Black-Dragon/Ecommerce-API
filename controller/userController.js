const UserModel = require("../model/User");
const cookieToken = require("../utils/CookieToken");
const cloudinary = require("cloudinary").v2;
const mailHelper = require("../utils/NodeMailer");
const crypto = require("crypto");
const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const client = require("../config/redisDB");
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
    console.log(`validateResult: ${validateResult}`);
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
      throw createError.Conflict(
        `${existingUser.email} is already been registered`
      );
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
    console.log(error.message);
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
    //deleting refresh token from redisDB
    const token = req.cookies.token;
    //making the cookie expiry  options
    const options = {
      expires: new Date(Date.now()),
      httpOnly: true,
    };
    //verify token   to get user id
    const result = await JWT.verify(token, process.env.JWT_REFRESH_KEY);
    //storing  user.id
    const userId = result.id;
    //deleting refresh token from redis db

    client.DEL(userId, (err, val) => {
      if (err) {
        console.log(err.message);
        throw createError.InternalServerError();
      }
      console.log(val);
    });

    //setting cookie to null when logout route is requested
    res.status(200).cookie("token", null, options).json({
      success: true,
      message: "logout success",
    });
  } catch (error) {
    console.log(error);
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

exports.refreshTokenRenewal = async (req, res, next) => {
  try {
    //getting refresh token from req cookie
    const token = req.cookies?.token;
    //if cookie is null
    if (!token) throw createError.BadRequest();
    //verify refresh token
    const result = await JWT.verify(token, process.env.JWT_REFRESH_KEY);
    //storing use id from result
    const userId = result.id;
    //fetching key from redis
    const redisResult = await client.GET(userId);
    // checking  if req.cookie.token is same as token from redis db
    if (token !== redisResult) {
      throw createError.Unauthorized();
    }
    //if its same then find the user in db
    const user = await UserModel.findById(userId);
    // creating new refresh tokenand access token
    cookieToken(user, res);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.userDashboard = async (req, res, next) => {
  try {
    //req.user is injected through middleware
    const user = req?.user;
    // if user is missing
    if (!user) {
      throw createError.Unauthorized;
    }
    //if user
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const userId = req?.user?._id;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!userId) {
      throw createError.Unauthorized();
    }
    if (!(oldPassword && newPassword && confirmNewPassword)) {
      throw createError.BadRequest();
    }

    const user = await UserModel.findById(userId).select("+password");
    if (!user) throw createError.NotFound();

    const isPAsswordCorrect = await user.isPasswordValid(oldPassword);
    if (!isPAsswordCorrect) {
      throw createError.Unauthorized("password invalid");
    }
    if (newPassword !== confirmNewPassword) {
      throw createError.BadRequest(
        "password and confirm password does not match"
      );
    }
    // checking is old and new password are same
    if (oldPassword === newPassword) {
      throw createError.BadRequest(" new password cannot be same as old one  ");
    }
    // update password field in DB
    user.password = newPassword;

    // save the user
    await user.save();

    // send a JSON response

    res.status(200).json({ message: " password update successfully" });
  } catch (error) {
    next(error);
  }
};
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req?.user?._id;

    if (!userId) {
      throw createError.Unauthorized();
    }

    // collect data from body
    const newData = {
      name: req.body.name,
      email: req.body.email,
    };

    // if photo comes to us
    if (req.files) {
      const user = await UserModel.findById(req.user._id);

      const imageId = user.profilePhoto.id;

      // delete photo on cloudinary
      const resp = await cloudinary.uploader.destroy(imageId);

      // upload the new photo
      const result = await cloudinary.uploader.upload(
        req.files.profile.tempFilePath,
        {
          folder: "users",
          width: 150,
          crop: "scale",
        }
      );

      // add photo data in newData object
      newData.profilePhoto = {
        id: result.public_id,
        secured_Url: result.secure_url,
      };
    }

    // update the data in user
    const user = await UserModel.findByIdAndUpdate(req.user.id, newData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.send("successful");
  } catch (error) {
    next(error);
  }
};

// admin controllers
exports.adminGetAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find({ role: "user" });
    const sellers = await UserModel.find({ role: "seller" });
    const managers = await UserModel.find({ role: "manager" });

    res.status(200).json({
      success: true,
      message: "  users with roles managers,sellers and user are listed below",
      users,
      sellers,
      managers,
    });
  } catch (error) {
    next(error);
  }
};

exports.adminGetAUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    res.status(200).json({
      success: true,
      message: ` The details of user ${user?.name} are as follows`,
      details: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.adminPromoteOrDe_PromoteAUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role) {
      throw createError.Conflict(
        `cant promote or de-promote user to undefine role`
      );
    }
    const update = await UserModel.findByIdAndUpdate({ role: role });
    res.status(201).json({
      success: true,
      message: `user role changed to ${user.role}`,
    });
  } catch (error) {
    next(error);
  }
};

exports.adminDeleteAUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await UserModel.findByIdAndDelete(id).then((result) => {
      res.status(200).json({
        deleted: true,
        success: true,
        message: `user with id : ${id} has been removed or deleted from our db`,
      });
    });
  } catch (error) {
    next(error);
  }
};
