const mongoose = require("mongoose");

const BuyerSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
      match:
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      unique: true,
      required: true,
      lowercase: true,
    },
    phoneNo: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    authId: {
      type: String,
    },
    profileImage: {
      type: [String],
    },
    isUpdated: {
      type: Boolean,
      default: false,
    },
    documentId: {
      type: mongoose.Schema.ObjectId,
      ref: "document",
      default: null,
    },
    role: {
      type: String,
      default: "buyer",
    },
  },
  {
    timeStamps: true,
  }
);

const BuyerModel = mongoose.model("buyer", BuyerSchema);

module.exports = BuyerModel;
