const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const studentSchema = require("../Schemas/studentSchema");
const Student = new mongoose.model("Student", studentSchema);
const checkLogin = require("../middlewares/checkLogin");
const adminSchema = require("../Schemas/adminSchema");
const Admin = new mongoose.model("Admin", adminSchema);

//To get only active students
router.get("/active", checkLogin, async (req, res) => {
  const student = new Student();
  const data = await student.findActive();
  res.status(200).json({
    data, //data: data, //easy format of this
  });
});

//To get only Node js students
router.get("/node", checkLogin, async (req, res) => {
  const data = await Student.findNode();
  res.status(200).json({
    data,
  });
});

//To get students by their name
router.get("/:name", checkLogin, async (req, res) => {
  const data = await Student.find().findName(req.params.name);
  res.status(200).json({
    data,
  });
});

//Get all students
router.get("/", checkLogin, async (req, res) => {
  try {
    // const data = await Student.find({ status: "active" });

    //const data = await Student.find();

    const data = await Student.find({}) //inside {} braces is mandatory
      .populate("admin", "name username -_id") //with populate we can see the user details(by whom the student created). Inside populate we have to put the name of the relational field name from Student table which is admin. (- _id means we won't gonna see id of the admin)
      .limit(2)
      .select({
        _id: 0,
        date: 0,
        __v: 0,
      }); //We can use method chaining
    //in select if we set 0 it won't gonna show in response. if we set 1 it will gonna show in response. default is 1.

    res.status(200).json({
      data: data,
      message: "Successfull",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "There is a server side error",
    });
  }
});

//Get a single students
router.get("/:id", checkLogin, async (req, res) => {
  try {
    const data = await Student.find({ _id: req.params.id });

    res.status(200).json({
      data: data,
      message: "Successfull",
    });
  } catch (err) {
    res.status(500).json({
      message: "There is a server side error",
    });
  }
});

//Create a student
router.post("/", checkLogin, async (req, res) => {
  try {
    const newStudent = new Student({
      ...req.body,
      admin: req.userId,
    });

    const student = await newStudent.save();

    await Admin.updateOne(
      { _id: req.userId },
      {
        $push: {
          students: student._id,
        },
      }
    );

    res.status(200).json({
      message: "Student inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "There is a server side error",
    });
  }
});

//Create multiple student
router.post("/all", checkLogin, async (req, res) => {
  try {
    await Student.insertMany(req.body);
    res.status(200).json({
      message: "Student inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "There is a server side error",
    });
  }
});

//Update one student
router.put("/:id", checkLogin, async (req, res) => {
  try {
    await Student.updateOne(
      {
        _id: req.params.id, //we can search by any other parameter
      },
      {
        $set: {
          status: req.body.status,
        },
      }
    );
    res.status(200).json({
      message: "Student Updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "There is a server side error",
    });
  }
});

//To get what i changes in update
router.put("/changes/:id", checkLogin, async (req, res) => {
  try {
    const std = await Student.findByIdAndUpdate(
      {
        _id: req.params.id, //we can search by any other parameter
      },
      {
        $set: {
          status: req.body.status,
        },
      },
      {
        new: true, //defaultly it shows previous unupdated data. but after "new:true" it will show updated data.
      }
    );
    res.status(200).json({
      res: std,
      message: "Student Updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "There is a server side error",
    });
  }
});

//Delete a single students
router.delete("/:id", checkLogin, async (req, res) => {
  try {
    const data = await Student.deleteOne({ _id: req.params.id });

    res.status(200).json({
      data: data,
      message: "Successfull deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: "There is a server side error",
    });
  }
});

//Delete multiple students
router.delete("/", checkLogin, async (req, res) => {
  try {
    const data = await Student.deleteMany({ status: "active" });

    res.status(200).json({
      data: data,
      message: "Successfull deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: "There is a server side error",
    });
  }
});

module.exports = router;
