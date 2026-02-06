require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");

require("./src/config/passport");

const authRoutes = require("./src/routes/auth.routes.js");
const agencyRoutes = require("./src/routes/agency.routes.js");
const routes = require("./src/routes/routes.js");

const vehicleRoutes = require("./src/routes/vehicle.routes.js");
const reservationRoutes = require("./src/routes/reservation.routes.js");
const dashboardRoutes = require("./src/routes/dashboard.routes.js");
const paymentRoutes = require("./src/routes/payment.routes.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", routes);
app.use("/auth", authRoutes);
app.use("/agencies", agencyRoutes);

app.use("/api/vehicles", vehicleRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
    res.send("API OK");
});

app.use((err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;