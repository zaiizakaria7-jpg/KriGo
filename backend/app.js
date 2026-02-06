require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");

// Import passport config to register OAuth strategies
require("./src/config/passport");

// Import Existing Routes
const authRoutes = require("./src/routes/auth.routes.js");
const agencyRoutes = require("./src/routes/agency.routes.js");
const routes = require("./src/routes/routes.js");

// Import Teammate's Routes
const vehicleRoutes = require("./src/routes/vehicle.routes.js");
const reservationRoutes = require("./src/routes/reservation.routes.js");
const dashboardRoutes = require("./src/routes/dashboard.routes.js");
const paymentRoutes = require("./src/routes/payment.routes.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Mount Routes
app.use("/api/auth", routes); // Mixed register/login routes
app.use("/auth", authRoutes); // Auth routes
app.use("/agencies", agencyRoutes);

// Mount Teammate's Routes
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payments", paymentRoutes);

// Root Check Route
app.get("/", (req, res) => {
    res.send("API OK");
});

// Error Handling Middleware (Placeholder replacing missing errorMiddleware)
app.use((err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;