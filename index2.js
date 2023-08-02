const express = require("express");
const mongoose = require("mongoose");
const studentHandler = require("./routeHandler/studentHandler");
const adminHandler = require("./routeHandler/adminHandler");
const dotenv = require("dotenv"); //to extract data from .env file
const cors = require("cors");

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Database Connection with Mongose
mongoose
  .connect("mongodb://127.0.0.1:27017/school") //school = database name
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

app.use("/student", studentHandler);
app.use("/admin", adminHandler);

app.listen(process.env.PORT, () => {
  console.log("Listening to port 3000");
});
