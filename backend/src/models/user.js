const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String, 
  role: {
    type: String,
    default: "user"
  },
  agency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agency"
  },
  provider: {
    type: String,
    default: "local"
  },
  twoFactorSecret: {
    type: String
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  nom: String,
  prenom: String,
  CIN: String,
  city: String,
  address: String,
  phone: String,
  status: {
    type: String,
    default: "active"
  },
  lastLogin: {
    type: Date
  },
  profileImage: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
