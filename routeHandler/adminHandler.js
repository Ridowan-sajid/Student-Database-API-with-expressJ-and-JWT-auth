const express = require("express");
const router = express.Router();
const checkLogin = require("../middlewares/checkLogin");
const {
  signup,
  login,
  allAdmin,
  changePassword,
  forgetPassword,
} = require("../Controller/adminController");
const { registerValidation, loginValidation } = require("../validation/index");
const validationCheck = require("../validation/validMsg");

router.post("/signup", registerValidation, validationCheck, signup);

router.post("/login", loginValidation, validationCheck, login);
router.patch("/changePassword", checkLogin, changePassword);

router.get("/all", checkLogin, allAdmin);

router.get("/sentMail", forgetPassword);

module.exports = router;
