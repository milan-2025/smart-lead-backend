const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: String,
  country: String,
  probability: Number,
  status: {
    type: String,
    enum: ["Verified", "To Check"],
  },
});

module.exports = mongoose.model("Lead", leadSchema);
