const jwt = require("jsonwebtoken");
const BuyerModel = require("../modules/buyer/buyer.model");
const SellerModel = require("../modules/seller/seller.model");
const config = require("../configs");

// Token function
function createToken(data) {
  let token = jwt.sign(
    {
      _id: data._id,
      email: data.email,
      role: data.role,
      status: data.status,
      isVerified: data.isVerified,
    },
    config.jwtSecret
  );
  return token;
}

// Other functions
function sellerFindOne(params) {
  return new Promise(function (resolve, reject) {
    SellerModel.findOne(
      {
        authId: params.authId,
      },
      function (err, data) {
        if (err) {
          return reject(err);
        }
        resolve(data);
      }
    );
  });
}

function buyerFindOne(params) {
  return new Promise(function (resolve, reject) {
    BuyerModel.findOne(
      {
        authId: params.authId,
      },
      function (err, data) {
        if (err) {
          return reject(err);
        }
        resolve(data);
      }
    );
  });
}

module.exports = {
  createToken,
  buyerFindOne,
  sellerFindOne,
};
