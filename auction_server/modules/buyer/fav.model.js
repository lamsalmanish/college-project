const mongoose = require("mongoose");

const FavSchema = mongoose.Schema({
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
});

const FavModel = mongoose.model("fav", FavSchema);

module.exports = FavModel;
