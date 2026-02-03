const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        console.log("✅ User authenticated:", req.user.email, "Role:", req.user.role);
        const token = jwt.sign(
            { id: req.user._id, role: req.user.role },
            process.env.JWT_SECRET
        );
        res.json({ token });
    }
);

router.get(
    "/facebook",
    passport.authenticate("facebook")
);

router.get(
    "/facebook/callback",
    passport.authenticate("facebook", { session: false }),
    (req, res) => {
        console.log("✅ User authenticated via Facebook:", req.user.email, "Role:", req.user.role);
        const token = jwt.sign(
            { id: req.user._id, role: req.user.role },
            process.env.JWT_SECRET
        );
        res.json({ token });
    }
);

module.exports = router;
