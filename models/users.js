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
    
    password: {
      type: String,
      minlength: 8,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    psnNumber: {
      type: Number,
      required: true
    },
    localGovernmentArea: {
      type: String,
      required: true
    }, 
    ministry: {
      type: String,
      required: true
    },
    dateOfFirstAssignment: {
      type: String,
      required: true
    },
    lastPromotionDate: {
      type: String,
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

module.exports = mongoose.model("users", usersSchema);
