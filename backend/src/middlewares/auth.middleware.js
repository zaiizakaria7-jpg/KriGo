const jwt = require('jsonwebtoken');

/**
 * Middleware d'authentification JWT.
 * - Vérifie le header Authorization: "Bearer <token>"
 * - Si valide, attache { id, role } à req.user
 * - Si manquant ou invalide, répond 401 Unauthorized
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  // Vérifie le schéma Bearer
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Non autorisé: token manquant.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Supporte "role" et "rôle" pour compatibilité
    const role = decoded.role ?? decoded.rôle;
    req.user = { id: decoded.id, role, rôle: role };

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Non autorisé: token invalide.' });
  }
};

// Exports compatibles avec le code existant
module.exports = {
  authMiddleware,
  isAuth: authMiddleware,
  protect: authMiddleware
};
