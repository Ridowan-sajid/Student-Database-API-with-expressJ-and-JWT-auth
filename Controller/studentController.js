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
};

const getSingleStudent = async (req, res) => {
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
