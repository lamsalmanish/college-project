const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const AuthSchema = new Schema(
  {
    email: {
      type: String,
      match:
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserAuth = mongoose.model("user", AuthSchema);

const AdminSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
});

const AdminAuth = mongoose.model("admin", AdminSchema);

const createAuthValidator = (payload) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
  });
  return schema.validate(payload);
};

module.exports = {
  AdminAuth,
  UserAuth,
  createAuthValidator,
};
