import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("db connected"))
  .catch(() => console.log("db error"));
