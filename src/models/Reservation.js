const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  startDate: Date,
  endDate: Date,
  status: { type: String, default: "pending" }
});

module.exports = mongoose.model("Reservation", ReservationSchema);
