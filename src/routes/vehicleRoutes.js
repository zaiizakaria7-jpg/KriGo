const router = require("express").Router();
const { addVehicle, getVehicles } = require("../controllers/vehicleController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, addVehicle);
router.get("/", getVehicles);

module.exports = router;
