const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../middlewares/mailSent");
const adminSchema = require("../Schemas/adminSchema");
const Admin = new mongoose.model("Admin", adminSchema);
const otpSchema = require("../Schemas/otpSchema");
const Otp = new mongoose.model("Otp", otpSchema);
const { v4: uuidv4 } = require("uuid");

const signup = async (req, res) => {
  try {
    const prev = await Admin.findOne({ username: req.body.username });
    console.log(prev);
    if (!prev) {
      const salt = await bcrypt.genSalt();
      const hashedpassed = await bcrypt.hash(req.body.password, salt);

      const admin = new Admin({
        name: req.body.name,
        username: req.body.username,
        dob: req.body.dob,
        password: hashedpassed,
        status: req.body.status,
      });

      await admin.save();
      res.status(200).json({
        data: admin,
        message: "Successfull",
      });
    } else {
      res.status(201).json({
        message: "Already exist with same username",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "There is a server side error",
    });
  }
};

const login = async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: req.body.username });

    if (admin) {
      const isMatched = await bcrypt.compare(req.body.password, admin.password);
      if (isMatched) {
        console.log(admin);
        const token = jwt.sign(
          {
            username: admin.username,
            userId: admin._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "2h",
          }
        );

        res.status(200).json({
          token: token,
          message: "login Successful!",
        });
      } else {
        res.status(500).json({
          message: "You are not valid user",
        });
      }
    } else {
      res.status(500).json({
        message: "You are not valid user",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "There is a server side error",
    });
  }
};

//change Password
const changePassword = async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: req.username });

    if (admin) {
      const isMatched = await bcrypt.compare(
        req.body.oldPassword,
        admin.password
      );
      if (isMatched) {
        console.log(admin);
        const salt = await bcrypt.genSalt();
        const hashedpassed = await bcrypt.hash(req.body.newPassword, salt);

        await Admin.findByIdAndUpdate(
          {
            _id: req.userId,
          },
          {
            $set: {
              password: hashedpassed,
            },
          }
        );

        res.status(200).json({
          message: "Password Change Successful!",
        });
      } else {
        res.status(500).json({
          message: "You are not valid user",
        });
      }
    } else {
      res.status(500).json({
        message: "You are not valid user",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "There is a server side error",
    });
  }
};

//Forget Password
const forgetPassword = async (req, res) => {
  const uniqueId = uuidv4();

  const admin = await Admin.findOne({ email: req.body.email });

  if (admin) {
    const otp = new Otp({
      otpS: uniqueId.substring(0, 6),
      userId: admin._id,
      createdDate: new Date(),
    });
    console.log(otp);
    await otp.save();

    //sending mail
    const info = await transporter.sendMail({
      from: "hw733029@gmail.com",
      to: "sajidridowan7@gmail.com",
      subject: "Hello there",
      text: `Your otp: ${otp.otpS}`,
    });

    if (info.accepted) {
      res.status(200).json({
        message: "Message sent",
      });
    } else {
      res.status(500).json({
        message: "There is a server side error",
      });
    }
  }
};

//reset Password
const resetPassword = async (req, res) => {
  try {
    const otp = await Otp.findOne({ otpS: req.body.otp });
    const admin = await Admin.findOne({ _id: otp.userId });

    if (admin) {
      ///

      var currentDate = new Date();
      var specifiedDate = new Date(otp.createdDate);
      var difference = currentDate.getTime() - specifiedDate.getTime();
      var differenceInMinutes = Math.floor(difference / 1000 / 60);

      if (differenceInMinutes <= 5) {
        const salt = await bcrypt.genSalt();
        const hashedpassed = await bcrypt.hash(req.body.password, salt);

        await Admin.findByIdAndUpdate(
          {
            _id: admin._id,
          },
          {
            $set: {
              password: hashedpassed,
            },
          }
        );
        res.status(200).json({
          message: "Password Change Successful!",
        });
      } else {
        res.status(500).json({
          message: "Something is wrong!",
        });
      }
      ////
    }
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

//All admin List

const allAdmin = async (req, res) => {
  try {
    const admin = await Admin.find({}).populate("students");
    res.status(200).json({
      data: admin,
    });
  } catch (err) {
    res.status(500).json({
      message: "There is a server side error",
    });
  }
};

module.exports = {
  signup,
  login,
  allAdmin,
  changePassword,
  forgetPassword,
  resetPassword,
};
