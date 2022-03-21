const jwt = require("jsonwebtoken");
const config = require("./../configs");
const { UserAuth } = require("../models/auth.model");

module.exports = function (req, res, next) {
  var token;
  if (req.headers["authorization"]) token = req.headers["authorization"];
  if (req.headers["x-access-token"]) token = req.headers["x-access-token"];
  if (req.headers["token"]) token = req.headers.token;
  if (req.query.token) token = req.query.token;

  if (token) {
    jwt.verify(token, config.jwtSecret, function (err, decoded) {
      if (err) {
        next(err);
      }
      console.log("decoded value is >>", decoded);
      UserAuth.findById({ _id: decoded._id }).then(function (user) {
        if (user) {
          // database current record is attached in every request
          if (user.status === "suspended") {
            return next({
              msg: "err, your account is suspended",
            });
          }
          req.user = user;
          next();
        } else {
          next({
            msg: "User removed from the system",
          });
        }
      });
    });
  } else {
    next({
      msg: "Token not Provided",
      status: 400,
    });
  }
};
