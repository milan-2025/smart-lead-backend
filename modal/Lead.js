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
    isCRMSynced: {
      type: Boolean,
      default: false,
      required: true,
    },
    crmSyncDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);
