const { check } = require("express-validator");

const registerValidation = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name can't be empty")
    .isLength({ min: 7 })
    .withMessage("Name must have at least 7 characters"),
  check("username")
    .trim()
    .notEmpty()
    .withMessage("UserName can't be empty")
    .isLength({ min: 5 })
    .withMessage("userName must have at least 5 characters"),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password can't be empty")
    .isLength({ min: 8 })
    .withMessage("Password must have at least 8 characters"),
  check("dob")
    .trim()
    .notEmpty()
    .withMessage("Date of birth can't be empty")
    .isISO8601()
    .isDate()
    .withMessage("Not a valid a date of birth"),
  check("status")
    .isIn(["active", "inactive"])
    .withMessage("Status should active or inactive"),
];

const loginValidation = [
  check("username")
    .trim()
    .notEmpty()
    .withMessage("UserName can't be empty")
    .isLength({ min: 5 })
    .withMessage("userName must have at least 5 characters"),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password can't be empty")
    .isLength({ min: 8 })
    .withMessage("Password must have at least 8 characters"),
];

module.exports = { registerValidation, loginValidation };
