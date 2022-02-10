const cookieToken = (user, res) => {
  //jwt  creation
  const accessToken = user.jwtAccessTokenCreation();
  const refreshToken = user.jwtRefreshTokenCreation();
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    Secure: true,
  };
  user.password = undefined;
  //cookie creations
  res.status(200).cookie("refreshToken", refreshToken, options).json({
    success: true,
    access_token: accessToken,
    name: user.name,
  });
};
module.exports = cookieToken;
