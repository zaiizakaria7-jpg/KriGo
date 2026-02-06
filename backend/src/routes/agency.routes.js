import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import { isSuperAdmin } from "../middlewares/role.middleware.js";
import {
  create,
  getAll,
  update,
  remove
} from "../controllers/agency.controller.js";

const router = express.Router();

router.post("/", isAuth, isSuperAdmin, create);
router.get("/", isAuth, isSuperAdmin, getAll);
router.put("/:id", isAuth, isSuperAdmin, update);
router.delete("/:id", isAuth, isSuperAdmin, remove);

export default router;
