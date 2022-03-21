const router = require("express").Router();
const bcrypt = require("bcrypt");
const {
  AdminAuth,
  UserAuth,
  createAuthValidator,
} = require("../models/auth.model");
const BuyerModel = require("../modules/buyer/buyer.model");
const SellerModel = require("../modules/seller/seller.model");
const { createToken } = require("../helpers/helpers");

// Buyer and Seller Signup
router.post("/signup", (req, res, next) => {
  // validate Schema
  const { email, password, role } = req.body;
  UserAuth.findOne({ email: email }).then((user) => {
    console.log(user);
    if (user) {
      return next({
        msg: "Email already in Use",
      });
    } else {
      const { error } = createAuthValidator(req.body);
      if (error) {
        return next(error.details[0].message);
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            return next(err);
          } else {
            const userdata = {
              email: email,
              password: hash,
              role: role,
            };
            let signupData = new UserAuth(userdata);
            signupData
              .save()
              .then((data) => {
                if (data.role === "buyer") {
                  const buyerInfo = {
                    email: email,
                    authId: data._id,
                  };
                  let buyerData = new BuyerModel(buyerInfo);
                  buyerData.save().then((buyer) => {
                    return res.json({
                      msg: "Success! Buyer account created....Please login",
                    });
                  });
                } else {
                  let sellerData = new SellerModel({
                    email: email,
                    authId: data._id,
                  });
                  sellerData.save().then((seller) => {
                    return res.json({
                      msg: "Success!, Seller account created.Please login",
                    });
                  });
                }
              })
              .catch((err) => {
                return next(err);
              });
          }
        });
      }
    }
  });
});

// Admin Signup
router.post("/admin-signup", (req, res, next) => {
  const { username, password } = req.body;
  AdminAuth.findOne({ username: username }).then((admin) => {
    if (admin) {
      return next({
        msg: "Username already exist",
      });
    } else {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return next(err);
        } else {
          let signupData = new AdminAuth({
            username: username,
            password: hash,
          });
          signupData
            .save()
            .then((data) => {
              res.json({
                msg: "Admin Account Created",
                data,
              });
            })
            .catch((err) => {
              next(err);
            });
        }
      });
    }
  });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  UserAuth.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.status(400).json({
        msg: "Email not found",
      });
    } else {
      const hash = user.password;
      bcrypt.compare(password, hash, (err, result) => {
        if (err) {
          return res.status(400).json({
            msg: "Something went wrong",
          });
        }
        if (result) {
          var token = createToken(user);
          res.json({
            msg: "Login Successful!!",
            user,
            token,
          });
        }
        if (!result) {
          return res.status(401).json({
            msg: "Incorrect Password",
          });
        }
      });
    }
  });
});

// Admin login
router.post("/admin-login", (req, res, next) => {
  const { username, password } = req.body;
  AdminAuth.findOne({ username: username }).then((admin) => {
    if (!admin) {
      return res.status(400).json({
        msg: "Admin not found",
      });
    } else {
      const hash = admin.password;
      bcrypt.compare(password, hash, (err, result) => {
        if (err) {
          return res.status(400).json({
            msg: "Something went wrong",
          });
        }
        if (result) {
          var token = createToken(admin);
          res.json({
            msg: "Login Successful!!",
            admin,
            token,
          });
        }
        if (!result) {
          return res.status(401).json({
            msg: "Incorrect Password",
          });
        }
      });
    }
  });
});

module.exports = router;
