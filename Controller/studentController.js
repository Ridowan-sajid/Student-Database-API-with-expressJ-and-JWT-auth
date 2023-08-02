const mongoose = require("mongoose");
const studentSchema = require("../Schemas/studentSchema");
const Student = new mongoose.model("Student", studentSchema);
const adminSchema = require("../Schemas/adminSchema");
const Admin = new mongoose.model("Admin", adminSchema);

const active = async (req, res) => {
  const student = new Student();
  const data = await student.findActive();
  res.status(200).json({
    data, //data: data, //easy format of this
  });
};

const nodeStudent = async (req, res) => {
  const data = await Student.findNode();
  res.status(200).json({
    data,
  });
};

const studentByName = async (req, res) => {
  const data = await Student.find().findName(req.params.name);
  res.status(200).json({
    data,
  });
};

const allStudents = async (req, res) => {
  try {
    // const data = await Student.find({ status: "active" });

    //const data = await Student.find();

    const data = await Student.find({})
      .populate("admin", "name username -_id")
      .select({
        __v: 0,
      });

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
};

const getSingleStudent = async (req, res) => {
  try {
    const data = await Student.findById(req.params.id).populate(
      "admin",
      "name username -_id"
    );

    console.log(data);

    res.status(200).json({
      data: data,
      message: "Successfull",
    });
  } catch (err) {
    res.status(500).json({
      message: "There is a server side error",
    });
  }
};

const createStudent = async (req, res) => {
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
};

const createMultipleStudent = async (req, res) => {
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
};

const updateOneStudent = async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      message: "Student Updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "There is a server side error",
    });
  }
};
const updateTrackChanges = async (req, res) => {
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
};

const deleteSingleStudent = async (req, res) => {
  try {
    console.log("sfsd");
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
};

const deleteMultipleStudent = async (req, res) => {
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
};

module.exports = {
  active,
  allStudents,
  createMultipleStudent,
  createStudent,
  deleteMultipleStudent,
  deleteSingleStudent,
  getSingleStudent,
  nodeStudent,
  studentByName,
  updateOneStudent,
  updateTrackChanges,
};
