const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  name: String,
  type: String,
  pricePerDay: Number,
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model("Vehicle", VehicleSchema);
