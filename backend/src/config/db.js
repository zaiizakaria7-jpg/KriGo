const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("db connected");
  } catch (err) {
    console.error("db error", err);
    process.exit(1);
  }
};

module.exports = connectDB;
