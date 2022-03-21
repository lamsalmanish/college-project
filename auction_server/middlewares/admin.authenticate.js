const jwt = require("jsonwebtoken");
const config = require("../configs");
const { AdminAuth } = require("../models/auth.model");

module.exports = function (req, res, next) {
  var token;
  if (req.headers["authorization"]) token = req.headers["authorization"];
  if (req.headers["x-access-token"]) token = req.headers["x-access-token"];
  if (req.headers["admin_token"]) token = req.headers.admin_token;
  if (req.query.token) token = req.query.token;

  if (token) {
    jwt.verify(token, config.jwtSecret, function (err, decoded) {
      if (err) {
        next(err);
      }
      console.log("decoded value is >>", decoded);
      AdminAuth.findById({ _id: decoded._id }).then(function (admin) {
        if (admin) {
          // database current record is attached in every request
          console.log(admin);
          req.admin = admin;
          next();
        } else {
          next({
            msg: "Admin removed from the system",
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
