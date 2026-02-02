const router = require("express").Router();
const { createReservation, changeStatus } = require("../controllers/reservationController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, createReservation);
router.put("/:id/status", auth, changeStatus);

module.exports = router;
