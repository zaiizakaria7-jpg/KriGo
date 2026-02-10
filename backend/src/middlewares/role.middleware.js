module.exports.isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "admin_super" && req.user.role !== "super") return res.sendStatus(403);
  next();
};

module.exports.isAgency = (req, res, next) => {
  // Allows both Agency Admin and Super Admin
  if (req.user.role !== "admin_agency" && req.user.role !== "admin" &&
    req.user.role !== "admin_super" && req.user.role !== "super") {
    return res.sendStatus(403);
  }
  next();
};
