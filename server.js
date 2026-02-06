require("dotenv").config();
const app = require("./backend/app");
const connectDB = require("./backend/src/config/db");

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));
