const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema(
  {
    email_or_phone: {
      type: String,
      required: true,
    },
    code: {
      type: Number,
      required: Number,
    },

    expired_date: {
      type: Date,
      default: Date.now + process.env.EXPIRED_TIME_CODE,
    },
  },
  {
    timestamps: true,
  }
);
const Code = mongoose.model("codes", codeSchema);

module.exports = Code;
