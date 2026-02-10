require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const passport = require("passport");

require("./src/config/passport");

const authRoutes = require("./src/routes/auth.routes.js");
const agencyRoutes = require("./src/routes/agency.routes.js");
const userRoutes = require("./src/routes/user.routes.js");
const vehicleRoutes = require("./src/routes/vehicle.routes.js");
const reservationRoutes = require("./src/routes/reservation.routes.js");
const dashboardRoutes = require("./src/routes/dashboard.routes.js");
const paymentRoutes = require("./src/routes/payment.routes.js");

const app = express();

// Import passport config
require("./src/config/passport");


// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Static folder for uploads
const path = require("path");
const uploadPath = path.resolve(__dirname, "uploads");
if (!require("fs").existsSync(uploadPath)) {
    require("fs").mkdirSync(uploadPath, { recursive: true });
}
app.use("/uploads", express.static(uploadPath));

// --- Routes Mounting ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/agencies", agencyRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payments", paymentRoutes);

// Base verification route
app.get("/", (req, res) => {
    res.send("API OK");
});

// --- Error Handling ---
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : (res.statusCode || 500);
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;