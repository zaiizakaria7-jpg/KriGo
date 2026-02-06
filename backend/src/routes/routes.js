const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/auth.controller.js");

// Route pour l'enregistrement d'un nouvel utilisateur
router.post("/register", registerUser);

// Route pour la connexion d'un utilisateur
router.post("/login", loginUser);

module.exports = router;
