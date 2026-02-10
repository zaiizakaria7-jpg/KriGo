const { verifyToken } = require("../utils/jwt");
const User = require("../models/user");
const Agency = require("../models/Agency");

module.exports.isAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);

  const token = header.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    const decoded = verifyToken(token);

    // Fetch user from DB to check status
    const user = await User.findById(decoded.id).populate('agency');

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    // Check if User is suspended
    if (user.status !== "active") {
      return res.status(403).json({ message: "Votre compte est suspendu." });
    }

    // If user is part of an agency, check agency status
    if (user.agency && user.role !== "super" && user.role !== "admin_super") {
      if (user.agency.status !== "active") {
        return res.status(403).json({ message: "L'agence est suspendue. Accès refusé." });
      }
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.sendStatus(403);
  }
};
