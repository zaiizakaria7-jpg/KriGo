const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  CIN: String,
  city: String,
  address: String,
  phone: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["user", "agency_admin", "super_admin"],
    default: "user"
  },
  date_naissance: Date,
  provider: {
    type: String,
    default: "local"
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
