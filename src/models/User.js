import mongoose from "mongoose";

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
  }
});

export default mongoose.model("User", userSchema);
