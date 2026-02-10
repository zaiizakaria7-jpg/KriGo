require("dotenv").config({ path: "../.env" });
const app = require("./app.js");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log("server running on " + PORT);
});
