const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminSchema = require("../Schemas/adminSchema");
const checkLogin = require("../middlewares/checkLogin");
const Admin = new mongoose.model("Admin", adminSchema);

router.post("/signup", async (req, res) => {
  try {
    const prev = await Admin.find({ username: req.body.username });

    if (!prev[0]) {
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
    const admin = await Admin.find({ username: req.body.username }); //it will give me admin as list of object not as a single object
    console.log(admin);
    if (admin && admin.length > 0) {
      const isMatched = await bcrypt.compare(
        req.body.password,
        admin[0].password //though we are getting a list of object that means we have to take first object from that list. If there is multiple admin with same username then its gonna be an error
      );
      if (isMatched) {
        const token = jwt.sign(
          {
            username: admin[0].username,
            userId: admin[0]._id,
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
