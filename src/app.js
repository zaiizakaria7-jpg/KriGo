import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";

import "./config/db.js";
import "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import agencyRoutes from "./routes/agency.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/agencies", agencyRoutes);

export default app;
