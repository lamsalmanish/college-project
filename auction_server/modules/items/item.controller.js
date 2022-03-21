const authenticate = require("../../middlewares/authenticate");

const router = require("express").Router();
const upload = require("../../middlewares/uploader");
const BidModel = require("../buyer/bid.model");
const ItemModel = require("./item.model");

router.post("/", authenticate, upload.any(), (req, res, next) => {
  if (req.fileError) {
    return next({
      msg: req.fileError,
      status: 400,
    });
  }
  if (req.files) {
    req.body.images = req.files.map((file, i) => {
      return file.filename;
    });
  }
  req.body.seller_info = req.user._id;
  let itemData = new ItemModel(req.body);
  itemData
    .save()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      return next(err);
    });
});

router.get("/", (req, res, next) => {
  ItemModel.find({})
    .populate("seller_info", {
      isVerified: 1,
      email: 1,
    })
    .sort({
      _id: -1,
    })
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

// Get my property
router.get("/myitem", authenticate, (req, res, next) => {
  ItemModel.find({ seller_info: req.user._id })
    .sort({
      _id: -1,
    })
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

// Get all Bid amount for property
router.post("/bid", (req, res, next) => {
  console.log(req.body);
  BidModel.find({ itemId: req.body.itemId })
    .populate("buyerId", {
      email: 1,
    })
    .sort({ _id: -1 })
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      return next(err);
    });
});

module.exports = router;
