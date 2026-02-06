/**
 * Middleware d'autorisation par rôle.
 * @param {...string} allowedRoles - Rôles autorisés (ex: 'user', 'admin_agence', 'super_admin')
 * À utiliser après authMiddleware.
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // Authentification requise (req.user posé par authMiddleware)
    const userRole = req.user && (req.user.role ?? req.user.rôle);
    if (!userRole) {
      return res.status(401).json({ message: 'Non autorisé. Authentification requise.' });
    }

    // Autorisation par rôle
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Accès refusé. Rôle non autorisé.' });
    }

    return next();
  };
};

// Helpers pratiques + compatibilité avec le code existant
const isSuperAdmin = roleMiddleware('super_admin');
const isAdminAgence = roleMiddleware('admin_agence');
const isUser = roleMiddleware('user');

module.exports = {
  roleMiddleware,
  authorize: roleMiddleware,
  hasRole: roleMiddleware,
  isSuperAdmin,
  isAdminAgence,
  isUser
};
