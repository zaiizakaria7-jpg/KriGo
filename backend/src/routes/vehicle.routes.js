const express = require("express");
const router = express.Router();
const controller = require("../controllers/vehicle.controller");
const { isAuth } = require("../middlewares/auth.middleware");
const { isAgency } = require("../middlewares/role.middleware");

// Public routes
router.get("/", controller.getVehicles);
router.get("/:id", controller.getVehicleById);

// Protected routes (Agency Admin)
router.post("/", isAuth, isAgency, controller.addVehicle);
router.put("/:id", isAuth, isAgency, controller.updateVehicle);
router.delete("/:id", isAuth, isAgency, controller.deleteVehicle);

module.exports = router;
