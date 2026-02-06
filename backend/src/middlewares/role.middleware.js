export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "super-admin") return res.sendStatus(403);
  next();
};

export const isAgency = (req, res, next) => {
  if (req.user.role !== "agency") return res.sendStatus(403);
  next();
};
