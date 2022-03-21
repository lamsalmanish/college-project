const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    title_desc: {
      type: String,
    },
    seller_info: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    base_price: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    expiry_date: {
      type: Date,
    },
    category: {
      type: String,
      required: true,
    },
    auction_type: {
      type: String,
    },
    isSold: {
      type: Boolean,
      default: false,
    },
    images: [String],
    buyerId: {
      type: mongoose.Schema.ObjectId,
      ref: "buyer",
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timeStamps: true,
  }
);

const ItemModel = mongoose.model("item", ItemSchema);

module.exports = ItemModel;
