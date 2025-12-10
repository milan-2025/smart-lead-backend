const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const leadRouter = require("./routes/lead.routes");
const { startAutomation } = require("./cron-jobs");
dotenv.config();

const app = express();
mongoose
  .connect(process.env.URI)
  .then(() => {
    console.log("connected to db");
    startAutomation();
    app.listen(process.env.PORT, () => {
      console.log("server started");
    });
  })
  .catch((err) => {
    console.log("err while starting or connecting to db", err);
  });

app.use(cors());
app.use(express.json());

app.use("/api/", leadRouter);
