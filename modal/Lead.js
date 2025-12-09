const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    country: String,
    probability: Number,
    status: {
      type: String,
      enum: ["Verified", "To Check"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);
