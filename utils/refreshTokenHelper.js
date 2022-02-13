const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const client = require("../config/redisDB");

const verifyRefreshToken = (refreshToken) => {
  try {
    return new Promise((resolve, reject) => {
      JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) return reject(createError.Unauthorized());
          const userId = payload.aud;
          client.GET(userId, (err, result) => {
            if (err) {
              console.log(err.message);
              reject(createError.InternalServerError());
              return;
            }
            if (refreshToken === result) return resolve(userId);
            reject(createError.Unauthorized());
          });
        }
      );
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyRefreshToken,
};
