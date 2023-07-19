const express = require("express");
const mongoose = require("mongoose");
const studentHandler = require("./routeHandler/studentHandler");
const adminHandler = require("./routeHandler/adminHandler");
const dotenv = require("dotenv"); //to extract data from .env file

const app = express();
dotenv.config();
app.use(express.json());

//Database Connection with Mongose
mongoose
  .connect("mongodb://127.0.0.1:27017/school") //school = database name
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

app.use("/student", studentHandler);
app.use("/admin", adminHandler);

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
