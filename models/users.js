const mongoose = require("mongoose");

const usersSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    state: {
      type: String,
      required: true
    },
    language: {
        type: String,
        required: true
    },
    password: {
      type: String,
      minlength: 8,
      required: true,
    },
    capacityOfAnimals: {
        type: Number,
        required: true
    },
    rememberToken: {
      token: {
        type: String,
        default: null,
      },
      expiredDate: {
        type: Date,
        default: null,
      },
    },
    passwordRetrieve: {
      resetPasswordToken: {
        type: String,
        default: null,
      },
      resetPasswordExpires: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", usersSchema);
