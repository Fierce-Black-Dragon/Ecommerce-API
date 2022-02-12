const createError = require("http-errors");
const client = require("../config/redisDB");
const cookieToken = async (user, res) => {
  //jwt  accessToken creation
  const accessToken = await user.jwtAccessTokenCreation();

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    Secure: true,
  };
  //refreshToken
  const refreshToken = await user.jwtRefreshTokenCreation();

  //storing  refreshToken in redis with userId as key
  client.SET(user._id, refreshToken, {
    EX: 7 * 24 * 60 * 60,
  });
  //
  user.password = undefined;
  //cookie creations
  res.status(200).cookie("refreshToken", refreshToken, options).json({
    success: true,
    access_token: accessToken,
    name: user.name,
    role: user.role,
  });
};
module.exports = cookieToken;
