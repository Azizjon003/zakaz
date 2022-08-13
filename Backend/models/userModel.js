const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    account_id: {
      type: Number,
    },
    full_name: {
      type: String,
      minLength: 3,
      maxLength: 50,
      required: true,
    },
    birth_date: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Emailni to'g'ri kirit"],
      lowerCae: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      validate: [validator.isStrongPassword],
      required: true,
      select: false,
    },
    password_confirm: {
      type: String,
      required: true,
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Siz bir xil password kiriting",
      },
    },
    phone_active: {
      type: Boolean,
      default: false,
    },
    email_active: {
      type: Boolean,
      default: false,
    },
    active_user: {
      type: Boolean,
      default: true,
    },
    password_change_date: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("users", userSchema);

module.exports = User;
