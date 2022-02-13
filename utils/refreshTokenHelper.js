// const JWT = require("jsonwebtoken");
// const createError = require("http-errors");
// const client = require("../config/redisDB");
// const User = require("../model/User");
// const verifyRefreshToken = async (refreshToken) => {
//   try {
//     return new Promise((resolve, reject) => {
//       JWT.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, payload) => {
//         if (err) {
//           return reject(createError.Unauthorized());
//         }
//         const userId = payload.aud;
//         client.GET(userId, async (err, result) => {
//           if (err) {
//             console.log(err.message);
//             reject(createError.InternalServerError());
//             return;
//           }
//           if (refreshToken === result) {
//             const user = await UserModel.findById(userId);
//             return resolve(user);
//           }
//           reject(createError.Unauthorized());
//         });
//       });
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   verifyRefreshToken,
// };
