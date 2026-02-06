require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");

// Import passport config
require("./src/config/passport");

// --- Importation des Routes ---
// 'authRoutes' contient désormais les routes pour l'enregistrement et la connexion locales.
const authRoutes = require("./src/routes/routes.js"); 
const agencyRoutes = require("./src/routes/agency.routes.js");
const userRoutes = require("./src/routes/user.routes.js");
// Les anciennes routes 'auth.routes.js' et 'routes.js' sont maintenant consolidées.

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// --- Montage des Routes ---
// Toutes les routes d'authentification (register, login) sont maintenant sous /api/auth
app.use("/api/auth", authRoutes);
// Les routes pour les utilisateurs
app.use("/api/users", userRoutes);
// Les routes pour les agences
app.use("/api/agencies", agencyRoutes);


// Route de vérification de base
app.get("/", (req, res) => {
    res.send("API OK");
});

// --- Gestion des Erreurs ---
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        // Afficher la stack trace uniquement en développement
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;
