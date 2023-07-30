const mongoose = require("mongoose");
const { Stream } = require("nodemailer/lib/xoauth2");

const otpSchema = mongoose.Schema({
  otpS: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  createdDate: {
    type: Date,
    required: true,
  },
});

module.exports = otpSchema;
