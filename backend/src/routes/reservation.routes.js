const express = require("express");
const router = express.Router();
const controller = require("../controllers/reservation.controller");
const { isAuth } = require("../middlewares/auth.middleware");
const { isAgency } = require("../middlewares/role.middleware");

// User routes
router.post("/", isAuth, controller.createReservation);
router.post("/check", controller.checkAvailability); // Can be public or protected
router.get("/", isAuth, controller.getReservations);

// Admin routes
router.patch("/:id/status", isAuth, isAgency, controller.updateReservationStatus);

module.exports = router;
