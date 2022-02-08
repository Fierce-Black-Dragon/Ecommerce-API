const cookieToken = (user, res) => {
  //jwt  creation
  const token = user.jwtTokenCreation();
  const options = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    Secure: true,
  };
  user.password = undefined;
  //cookie creations
  res.status(200).cookie("auth_token", token, options).json({
    success: true,
    userId: user._id,
    email: user.email,
  });
};
module.exports = cookieToken;
