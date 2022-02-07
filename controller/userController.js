const UserModel = require("../model/User");
const cookieToken = require("../utils/CookieToken");
const cloudinary = require("cloudinary").v2;
const mailHelper = require("../utils/NodeMailer");
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let responseImage;

    // checking if file is send
    if (!req.files) {
      res.status(400).json({ error: " profileImage is missing" });
    }
    const file = req.files.profile;
    console.log(file);
    if (file.tempFilePath) {
      responseImage = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "users",
        width: 150,
        crop: "scale",
      });
    }

    //finding if any filed is pending
    if (!(name && email && password)) {
      res.status(404).json({
        success: false,
        error: "all fields are required",
      });
    }
    //finding if user is already register
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      res.status(404).send({ error: "user already exists" });
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
    //token creation function
    cookieToken(user, res);
  } catch (error) {
    console.log(error);
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //finding if any filed is pending
    if (!(email && password)) {
      res.status(404).json({
        error: "email or password is missing",
      });
    }
    //finding the user in database  using email
    const user = await UserModel.findOne({ email }).select("+password");
    //if user is not found
    if (!user) {
      res.status(404).send({ error: "email or password incorrect" });
    }
    // checking  if enter password is correct
    const isPAsswordCorrect = await user.isPasswordValid(password);
    if (!isPAsswordCorrect) {
      res.status(404).send({ error: "email or password incorrect" });
    }

    //token creation function
    cookieToken(user, res);
  } catch (error) {
    console.log(error);
  }
};

// log out user
exports.logout = async (req, res) => {
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
    console.error(error);
  }
};
//forgot password token
exports.ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    //checking if email is send
    if (!email) {
      res.status(400).json({ message: "email required" });
    }
    const user = await UserModel.findOne({ email });
    //checking if user with this email is register  in our database
    if (!user) {
      res.status(404).send({ error: "user not found" });
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
      res.status(500).json({ errorMessage: error });
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
};

exports.reset = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
  }
};
