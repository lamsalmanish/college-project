const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/uploader");
const ItemModel = require("../items/item.model");
const BidModel = require("./bid.model");
const FavModel = require("./fav.model");
const router = require("express").Router();

router.post("/fav", authenticate, (req, res, next) => {
  FavModel.find(
    {
      buyerId: req.user._id,
      itemId: req.body.itemId,
    },
    function (err, docs) {
      if (err) {
        return res.status(400).json({
          msg: "Something went wrong",
        });
      } else {
        if (docs.length === 0) {
          req.body.buyerId = req.user._id;
          const favData = new FavModel(req.body);
          favData
            .save()
            .then(function (data) {
              res.status(200).json({
                msg: "added to favourite",
                data,
              });
            })
            .catch(function (err) {
              next(err);
            });
        } else {
          FavModel.findByIdAndRemove({ _id: docs[0]._id }, (err, done) => {
            if (err) {
              console.log("cant remove fav");
            } else {
              return res.status(200).json({
                msg: "Remove from fav",
              });
            }
          });
        }
      }
    }
  );
});

router.get("/fav", authenticate, (req, res, next) => {
  FavModel.find({ buyerId: req.user._id })
    .populate("itemId", {
      title: 1,
      title_desc: 1,
      base_price: 1,
      start_date: 1,
      expiry_date: 1,
      category: 1,
      isSold: 1,
      isVerified: 1,
      images: 1,
    })
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/bid", authenticate, (req, res, next) => {
  BidModel.find(
    {
      buyerId: req.user._id,
      itemId: req.body.itemId,
    },
    (err, docs) => {
      if (err) {
        return next(err);
      } else {
        if (docs.length === 0) {
          req.body.buyerId = req.user._id;
          const bidData = new BidModel(req.body);
          bidData
            .save()
            .then((data) => {
              res.status(200).json({
                msg: `First bid has been placed at NRS.${req.body?.bidAmount}`,
              });
            })
            .catch((err) => {
              return next(err);
            });
        } else {
          BidModel.findByIdAndUpdate(
            { _id: docs[0]._id },
            { bidAmount: req.body.bidAmount },
            (err, done) => {
              if (err) {
                return next(err);
              } else {
                return res.status(200).json({
                  msg: `Bid amount has been updated at NRS. ${req.body?.bidAmount}`,
                });
              }
            }
          );
        }
      }
    }
  );
});

router.get("/mybids", authenticate, (req, res, next) => {
  BidModel.find({ buyerId: req.user._id })
    .populate("itemId", {
      title: 1,
      title_desc: 1,
      base_price: 1,
      start_date: 1,
      expiry_date: 1,
      category: 1,
      isSold: 1,
      isVerified: 1,
      images: 1,
    })
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
