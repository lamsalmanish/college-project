const mongoose = require("mongoose");

const SellerSchema = mongoose.Schema(
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
    profileImage: {
      type: [String],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    authId: {
      type: String,
    },
    isUpdated: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "seller",
    },
    documentId: {
      type: mongoose.Schema.ObjectId,
      ref: "document",
      default: null,
    },
  },
  {
    timeStamps: true,
  }
);

const SellerModel = mongoose.model("seller", SellerSchema);

module.exports = SellerModel;
