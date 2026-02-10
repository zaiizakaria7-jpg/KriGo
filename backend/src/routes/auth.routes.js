const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { login, register } = require("../controllers/auth.controller.js");

const router = express.Router();

const securityController = require('../controllers/security.controller');
router.post('/verify-2fa', securityController.verifyLogin2FA);

// Local Auth Routes
router.post("/login", login);
router.post("/register", register);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Google Auth Routes
router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"], session: false })
);

router.get(
    "/google/callback",
    (req, res, next) => {
        passport.authenticate("google", { session: false }, (err, user, info) => {
            if (err) {
                console.error("Google Auth Error:", err);
                return res.redirect(`${CLIENT_URL}/auth/login?error=GoogleAuthError`);
            }
            if (!user) {
                console.error("Google Auth Failed: No user found");
                return res.redirect(`${CLIENT_URL}/auth/login?error=GoogleAuthFailed`);
            }

            req.user = user;

            console.log("✅ User authenticated:", req.user.email, "Role:", req.user.role);
            const token = jwt.sign(
                {
                    id: req.user._id,
                    role: req.user.role,
                    email: req.user.email,
                    nom: req.user.nom,
                    prenom: req.user.prenom
                },
                process.env.JWT_SECRET
            );
            // Redirect to frontend with token
            res.redirect(`${CLIENT_URL}/auth/callback?token=${token}`);
        })(req, res, next);
    }
);

router.get(
    "/facebook",
    passport.authenticate("facebook", { scope: ["email"], session: false })
);

router.get(
    "/facebook/callback",
    (req, res, next) => {
        passport.authenticate("facebook", { session: false }, (err, user, info) => {
            if (err) {
                console.error("Facebook Auth Error:", err);
                return res.redirect(`${CLIENT_URL}/auth/login?error=FacebookAuthError`);
            }
            if (!user) {
                console.error("Facebook Auth Failed: No user found");
                return res.redirect(`${CLIENT_URL}/auth/login?error=FacebookAuthFailed`);
            }

            req.user = user;

            console.log("✅ User authenticated via Facebook:", req.user.email, "Role:", req.user.role);
            const token = jwt.sign(
                {
                    id: req.user._id,
                    role: req.user.role,
                    email: req.user.email,
                    nom: req.user.nom,
                    prenom: req.user.prenom
                },
                process.env.JWT_SECRET
            );
            res.redirect(`${CLIENT_URL}/auth/callback?token=${token}`);
        })(req, res, next);
    }
);

module.exports = router;
