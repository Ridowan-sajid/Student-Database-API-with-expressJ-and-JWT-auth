const express = require("express");
const router = express.Router();
const checkLogin = require("../middlewares/checkLogin");
const { signup, login, allAdmin } = require("../Controller/adminController");
const runValidation = require("../validation");
const validationCheck = require("../validation/validMsg");

router.post("/signup", runValidation, validationCheck, signup);

router.post("/login", login);

router.get("/all", checkLogin, allAdmin);

module.exports = router;
