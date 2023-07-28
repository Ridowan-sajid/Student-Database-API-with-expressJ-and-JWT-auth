var nodemailer = require("nodemailer");

const trasporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  ignoreTLS: true,
  secure: true,
  auth: {
    user: "hw733029@gmail.com",
    pass: "tiasqnrurjbohfor",
  },
});

module.exports = trasporter;
