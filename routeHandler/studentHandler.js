const express = require("express");
const router = express.Router();
const checkLogin = require("../middlewares/checkLogin");
const {
  active,
  nodeStudent,
  studentByName,
  allStudents,
  getSingleStudent,
  createStudent,
  createMultipleStudent,
  updateOneStudent,
  updateTrackChanges,
  deleteSingleStudent,
  deleteMultipleStudent,
} = require("../Controller/studentController");

//To get only active students
router.get("/active", checkLogin, active);

//To get only Node js students
router.get("/node", checkLogin, nodeStudent);

//To get students by their name
router.get("/name/:name", checkLogin, studentByName);

//Get all students
router.get("/", checkLogin, allStudents);

//Get a single students
router.get("/:id", checkLogin, getSingleStudent);

//Create a student
router.post("/", checkLogin, createStudent);

//Create multiple student
router.post("/all", checkLogin, createMultipleStudent);

//Update one student
router.put("/update/:id", checkLogin, updateOneStudent);

//To get what i changes in update
router.put("/changes/:id", checkLogin, updateTrackChanges);

//Delete a single students
router.delete("/:id", checkLogin, deleteSingleStudent);

//Delete multiple students
router.delete("/", checkLogin, deleteMultipleStudent);

module.exports = router;
