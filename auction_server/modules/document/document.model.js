const mongoose = require("mongoose");

const DocumentSchema = mongoose.Schema(
  {
    documentType: {
      type: String,
      required: true,
    },
    documentImage: [String],
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
  },
  {
    timeStamps: true,
  }
);

const DocumentModel = mongoose.model("document", DocumentSchema);

module.exports = DocumentModel;
