const Agency = require("../models/Agency");
const Vehicle = require("../models/Vehicle");
const Reservation = require("../models/Reservation");

exports.create = async (req, res) => {
  try {
    const agency = await Agency.create(req.body);
    res.status(201).json(agency);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const agencies = await Agency.find().lean();

    const agenciesWithStats = await Promise.all(agencies.map(async (agency) => {
      // Find vehicles belonging to this agency
      const vehicles = await Vehicle.find({ agency: agency._id }).select('_id');
      const vehicleIds = vehicles.map(v => v._id);

      const vehicleCount = vehicleIds.length;

      const reservations = await Reservation.find({ vehicle: { $in: vehicleIds } });
      const reservationCount = reservations.length;

      const revenue = reservations
        .filter(r => r.status === 'accepted')
        .reduce((sum, r) => sum + (r.totalPrice || 0), 0);

      return {
        ...agency,
        vehicleCount,
        reservationCount,
        revenue
      };
    }));

    res.json(agenciesWithStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const agency = await Agency.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!agency) return res.status(404).json({ message: "Agency not found" });
    res.json(agency);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Agency.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
