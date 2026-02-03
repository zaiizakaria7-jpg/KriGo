const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema({
  name: String,
  city: String,
  phone: String
});

module.exports = mongoose.model("Agency", agencySchema);
