const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/vehicles", require("./routes/vehicleRoutes"));
app.use("/api/reservations", require("./routes/reservationRoutes"));

app.use(errorHandler);
app.get("/", (req, res) => {
  res.send("API OK");
});

module.exports = app;
