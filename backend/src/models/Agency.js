const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema({
  name: String,
  location: String,
  status: {
    type: String,
    default: "active"
  }
}, { timestamps: true });

module.exports = mongoose.model("Agency", agencySchema);
