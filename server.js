const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
mongoose.connect(process.env.URI).then(() => {
  console.log("connected to db");
  app.listen(process.env.PORT, () => {
    console.log("server started");
  });
});
