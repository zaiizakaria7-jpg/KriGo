const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "super_admin") return res.sendStatus(403);
  next();
};

const isAgency = (req, res, next) => {
  if (req.user.role !== "agency_admin") return res.sendStatus(403);
  next();
};

module.exports = { isSuperAdmin, isAgency };
