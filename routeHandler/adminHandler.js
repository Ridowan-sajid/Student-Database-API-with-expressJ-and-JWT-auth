const express = require("express");
const router = express.Router();
const checkLogin = require("../middlewares/checkLogin");
const { signup, login, allAdmin } = require("../Controller/adminController");
const { registerValidation, loginValidation } = require("../validation/index");
const validationCheck = require("../validation/validMsg");

router.post("/signup", registerValidation, validationCheck, signup);

router.post("/login", loginValidation, validationCheck, login);

router.get("/all", checkLogin, allAdmin);

module.exports = router;
