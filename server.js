const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const leadRouter = require("./routes/lead.routes");
dotenv.config();

const app = express();
mongoose.connect(process.env.URI).then(() => {
  console.log("connected to db");
  app.listen(process.env.PORT, () => {
    console.log("server started");
  });
});

app.use(cors());
app.use(express.json());

app.use("/api/", leadRouter);
