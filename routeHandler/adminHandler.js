const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminSchema = require("../Schemas/adminSchema");
const Admin = new mongoose.model("Admin", adminSchema);
const checkLogin = require("../middlewares/checkLogin");

router.post("/signup", async (req, res) => {
  try {
    const prev = await Admin.findOne({ username: req.body.username });
    console.log(prev);
    if (!prev) {
      const salt = await bcrypt.genSalt();
      const hassedpassed = await bcrypt.hash(req.body.password, salt);

      const admin = new Admin({
        name: req.body.name,
        username: req.body.username,
        password: hassedpassed,
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
});

router.post("/login", async (req, res) => {
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
            expiresIn: "1h",
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
});

router.get("/all", checkLogin, async (req, res) => {
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
});

module.exports = router;
