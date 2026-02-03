require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");

// Import passport config to register OAuth strategies
require("./src/config/passport");

// Import routes
const authRoutes = require("./src/routes/auth.routes.js");
const agencyRoutes = require("./src/routes/agency.routes.js");
const routes = require("./src/routes/routes.js");


const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", routes);
app.use("/auth", authRoutes);
app.use("/agencies", agencyRoutes);

module.exports = app;
