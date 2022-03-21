const e = require("express");
const adminAuthenticate = require("../middlewares/admin.authenticate");
const { UserAuth } = require("../models/auth.model");
const BuyerModel = require("../modules/buyer/buyer.model");
const ItemModel = require("../modules/items/item.model");
const SellerModel = require("../modules/seller/seller.model");
const router = require("express").Router();

// Admin Get ALL Users
router.get("/getuser", adminAuthenticate, (req, res, next) => {
  UserAuth.find({})
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

// Get all buyers
router.get("/getbuyer", adminAuthenticate, (req, res, next) => {
  BuyerModel.find({})
    .populate("documentId", {
      documentType: 1,
      documentImage: 1,
    })
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

// Admin Get buyers by id
router.get("/getbuyer/:id", adminAuthenticate, (req, res, next) => {
  BuyerModel.findById({ _id: req.params.id })
    .populate("documentId", {
      documentType: 1,
      documentImage: 1,
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

// Admin Get all Sellers
router.get("/getseller", adminAuthenticate, (req, res, next) => {
  SellerModel.find({})
    .populate("documentId", {
      documentImage: 1,
      documentType: 1,
    })
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

// Admin Get by id
router.get("/getseller/:id", adminAuthenticate, (req, res, next) => {
  SellerModel.find({ _id: req.params.id })
    .populate("documentId", {
      documentType: 1,
      documentImage: 1,
    })
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

// Verify Buyer Profile
router.put("/verify-buyer/:id", adminAuthenticate, (req, res, next) => {
  const buyerId = req.params.id;
  BuyerModel.findById({ _id: buyerId }).then((buyer) => {
    if (!buyer) {
      return next({
        msg: "Buyer Not Found",
      });
    } else {
      if (buyer.isVerified === false) {
        BuyerModel.findByIdAndUpdate(
          { _id: buyerId },
          { isVerified: true },
          (err, done) => {
            if (err) {
              return next(err);
            } else {
              return res.json({
                msg: "Buyer Verified",
              });
            }
          }
        );
      } else {
        next({
          msg: "Buyer already verified",
        });
      }
    }
  });
});

// Verify Seller
router.put("/verify-seller/:id", adminAuthenticate, (req, res, next) => {
  const sellerId = req.params.id;
  SellerModel.findById({ _id: sellerId }).then((seller) => {
    if (!seller) {
      return next({
        msg: "Buyer Not Found",
      });
    } else {
      if (seller.isVerified === false) {
        SellerModel.findByIdAndUpdate(
          { _id: sellerId },
          { isVerified: true },
          (err, done) => {
            if (err) {
              return next(err);
            } else {
              return res.json({
                msg: "Seller Verified",
              });
            }
          }
        );
      } else {
        next({
          msg: "Seller already verified",
        });
      }
    }
  });
});

// List all properties
router.get("/getitems", adminAuthenticate, (req, res, next) => {
  ItemModel.find({})
    .populate("seller_info", {
      email: 1,
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

// Get properties by id
router.get("/getitems/:id", adminAuthenticate, (req, res, next) => {
  ItemModel.findById({ _id: req.params.id })
    .populate("seller_info", {
      email: 1,
    })
    .exec()
    .then((data) => {
      if (data === null) {
        return res.status(401).json({
          msg: "item not listed",
        });
      } else {
        res.json(data);
      }
    })
    .catch((err) => {
      next(err);
    });
});

// Verify Items
router.put("/verify-items/:id", adminAuthenticate, (req, res, next) => {
  ItemModel.findById({ _id: req.params.id }).then((data) => {
    if (data === null) {
      return next({
        msg: "Item not listed",
      });
    } else if (data.isVerified === false) {
      ItemModel.findByIdAndUpdate(
        { _id: req.params.id },
        { isVerified: true },
        (err, done) => {
          if (err) {
            return next(err);
          } else {
            res.json({
              msg: "Success !! Item Verified",
            });
          }
        }
      );
    } else {
      return next({
        msg: "Item already verified",
      });
    }
  });
});

// delete Items
router.delete("/delete-items/:id", adminAuthenticate, (req, res, next) => {
  ItemModel.findByIdAndRemove({ _id: req.params.id })
    .then((data) => {
      if (!data) {
        return next({
          msg: "Item already deleted",
        });
      } else {
        res.json({
          msg: "Item deleted",
        });
      }
    })
    .catch((err) => {
      next(err);
    });
});

// Suspend/Unsuspend User
router.put("/suspend/:id", adminAuthenticate, (req, res, next) => {
  UserAuth.findById({ _id: req.params.id })
    .then((user) => {
      if (user === null) {
        return next({
          msg: "User not found",
        });
      } else if (user.isSuspended === false) {
        UserAuth.findByIdAndUpdate(
          { _id: req.params.id },
          { isSuspended: true },
          (err, done) => {
            if (err) {
              return next(err);
            } else {
              return res.json({
                msg: "User Suspended",
                // data: done,
              });
            }
          }
        );
      } else {
        UserAuth.findByIdAndUpdate(
          { _id: req.params.id },
          { isSuspended: false },
          (err, done) => {
            if (err) {
              return next(err);
            } else {
              return res.json({
                msg: "User account unsuspended",
                // data: done,
              });
            }
          }
        );
      }
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
