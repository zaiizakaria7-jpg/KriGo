import mongoose from "mongoose";

const agencySchema = new mongoose.Schema({
  name: String,
  city: String,
  phone: String
});

export default mongoose.model("Agency", agencySchema);
