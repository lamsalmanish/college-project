const mongoose = require("mongoose");

const BidSchema = mongoose.Schema({
  itemId: {
    type: mongoose.Schema.ObjectId,
    ref: "item",
    required: true,
  },
  buyerId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  bidAmount: {
    type: String,
    required: true,
  },
});

const BidModel = mongoose.model("bid", BidSchema);

module.exports = BidModel;
