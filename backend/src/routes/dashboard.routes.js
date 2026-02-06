const express = require("express");
const router = express.Router();
const controller = require("../controllers/dashboard.controller");
const { isAuth } = require("../middlewares/auth.middleware");
const { isAgency } = require("../middlewares/role.middleware");

// Admin only stats
router.get("/stats", isAuth, isAgency, controller.getStats);

module.exports = router;
