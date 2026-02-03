const express = require("express");
const { isAuth } = require("../middlewares/auth.middleware.js");
const { isSuperAdmin } = require("../middlewares/role.middleware.js");
const { create, getAll, update, remove } = require("../controllers/agency.controller.js");

const router = express.Router();

router.post("/", isAuth, isSuperAdmin, create);
router.get("/", isAuth, isSuperAdmin, getAll);
router.put("/:id", isAuth, isSuperAdmin, update);
router.delete("/:id", isAuth, isSuperAdmin, remove);

module.exports = router;
