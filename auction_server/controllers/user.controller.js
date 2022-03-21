const e = require("express");
const { sellerFindOne, buyerFindOne } = require("../helpers/helpers");
const authenticate = require("../middlewares/authenticate");
const upload = require("../middlewares/uploader");
const BuyerModel = require("../modules/buyer/buyer.model");
const DocumentModel = require("../modules/document/document.model");
const SellerModel = require("../modules/seller/seller.model");
const router = require("express").Router();

router.get("/", authenticate, (req, res, next) => {
  Promise.all([
    sellerFindOne({ authId: req.user._id }),
    buyerFindOne({ authId: req.user._id }),
  ]).then((result) => {
    if (result[0] === null && result[1] === null) {
      return next({
        msg: "No user found",
      });
    }
    if (result[0] !== null) {
      const seller = result[0];
      res.json(seller);
    }
    if (result[1] !== null) {
      const buyer = result[1];
      res.json(buyer);
    }
  });
});

router.post("/", authenticate, upload.any(), (req, res, next) => {
  console.log(req.body);
  console.log(req.files);
  if (req.fileError) {
    return next({
      msg: req.fileError,
      status: 400,
    });
  }
  if (req.files) {
    req.body.profileImage = req.files.map(function (file, i) {
      return file.filename;
    });
  }
  req.body.isUpdated = true;
  Promise.all([
    sellerFindOne({ authId: req.user._id }),
    buyerFindOne({ authId: req.user._id }),
  ]).then((result) => {
    if (result[0] === null && result[1] === null) {
      return next({
        msg: "No user found",
      });
    }
    if (result[0] !== null) {
      const seller = result[0];
      SellerModel.findByIdAndUpdate(
        { _id: seller._id },
        { $set: req.body },
        { new: true }
      )
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          next(err);
        });
    }
    if (result[1] !== null) {
      const buyer = result[1];
      BuyerModel.findByIdAndUpdate(
        { _id: buyer._id },
        { $set: req.body },
        { new: true }
      )
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

router.post("/document", authenticate, upload.any(), (req, res, next) => {
  console.log(req.body);
  if (req.fileError) {
    return next({
      msg: req.fileError,
    });
  }
  if (req.files) {
    req.body.documentImage = req.files.map(function (file, i) {
      return file.filename;
    });
  }
  req.body.userId = req.user._id;
  DocumentModel.findOne({ userId: req.user._id })
    .then((data) => {
      if (data) {
        DocumentModel.findOneAndUpdate(
          { _id: data._id },
          req.body,
          (err, done) => {
            if (err) {
              return next(err);
            } else {
              return res.json({
                msg: "Document Updated",
              });
            }
          }
        );
      } else {
        const docData = new DocumentModel(req.body);
        docData
          .save()
          .then((data) => {
            if (req.user.role === "seller") {
              console.log("dataaaaaa", data);
              SellerModel.findOneAndUpdate(
                { authId: req.user._id },
                { documentId: data._id },
                (err, done) => {
                  if (err) {
                    console.log("error updating seller");
                  } else {
                    console.log("document id added to seller");
                  }
                }
              );
            } else {
              BuyerModel.findOneAndUpdate(
                { authId: req.user._id },
                { documentId: data._id },
                (err, done) => {
                  if (err) {
                    console.log("error updating buyer");
                  } else {
                    console.log("document id added to the buyer");
                  }
                }
              );
            }
            res.json({
              msg: "Document added suceesfully",
              data,
            });
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/document", authenticate, (req, res, next) => {
  DocumentModel.findOne({ userId: req.user._id })
    .then((data) => {
      if (!data) {
        return res.json({
          msg: "Please add documents for verification",
        });
      }
      return res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
