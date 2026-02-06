const Reservation = require("../models/Reservation");
const Vehicle = require("../models/Vehicle");

// Create Reservation
exports.createReservation = async (req, res) => {
    try {
        const { vehicleId, startDate, endDate } = req.body;
        const userId = req.user.id; // From auth middleware

        if (!vehicleId || !startDate || !endDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
            return res.status(400).json({ message: "End date must be after start date" });
        }

        // Check vehicle existence
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Check for double booking
        const existingReservation = await Reservation.findOne({
            vehicle: vehicleId,
            status: { $in: ["pending", "accepted"] },
            $or: [
                { startDate: { $lt: end }, endDate: { $gt: start } }
            ]
        });

        if (existingReservation) {
            return res.status(400).json({ message: "Vehicle is not available for these dates" });
        }

        // Calculate Price
        const oneDay = 24 * 60 * 60 * 1000;
        const days = Math.round(Math.abs((end - start) / oneDay));
        const totalPrice = days * vehicle.price_per_day;

        const reservation = new Reservation({
            user: userId,
            vehicle: vehicleId,
            startDate: start,
            endDate: end,
            totalPrice,
            status: "pending"
        });

        await reservation.save();
        res.status(201).json({ message: "Reservation created successfully", reservation });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Check Availability (Public/User)
exports.checkAvailability = async (req, res) => {
    try {
        const { vehicleId, startDate, endDate } = req.body;

        // Logic similar to create but returns boolean
        const start = new Date(startDate);
        const end = new Date(endDate);

        const existingReservation = await Reservation.findOne({
            vehicle: vehicleId,
            status: { $in: ["pending", "accepted"] },
            $or: [
                { startDate: { $lt: end }, endDate: { $gt: start } }
            ]
        });

        if (existingReservation) {
            return res.json({ available: false });
        }
        res.json({ available: true });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update Status (Admin Agence) - Accept/Refuse
exports.updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["accepted", "refused", "cancelled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const reservation = await Reservation.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate("vehicle user");

        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.json({ message: `Reservation ${status}`, reservation });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get Reservations (User: own, Admin: all for their agency?)
exports.getReservations = async (req, res) => {
    try {
        // If user is admin, show all (or filtered). If user, show own.
        // Assuming role is in req.user
        let query = {};
        if (req.user.role === "user") {
            query.user = req.user.id;
        }
        // If agency admin, we should filter by vehicles owned by their agency.
        // This is more complex, implies: Find vehicles by agencyId, then find reservations for those vehicles.

        // For now, simple implementation:
        const reservations = await Reservation.find(query)
            .populate("vehicle")
            .populate("user", "nom prenom email"); // Secure user data

        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
