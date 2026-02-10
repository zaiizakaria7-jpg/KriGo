const Reservation = require("../models/Reservation");
const Vehicle = require("../models/Vehicle");

// Create Reservation
exports.createReservation = async (req, res) => {
    try {
        const { vehicleId, startDate, endDate, cin, phone, options } = req.body;
        const userId = req.user.id; // From auth middleware

        if (!vehicleId || !startDate || !endDate || !cin || !phone) {
            return res.status(400).json({ message: "Missing required fields (vehicleId, startDate, endDate, cin, phone)" });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
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
                { startDate: { $lte: end }, endDate: { $gte: start } }
            ]
        });

        if (existingReservation) {
            return res.status(400).json({ message: "Vehicle is not available for these dates" });
        }

        // Calculate Price (Inclusive Days)
        const oneDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.round(Math.abs((end - start) / oneDay));
        const days = diffDays + 1; // 12->12=1 day, 12->13=2 days
        const totalPrice = days * vehicle.price_per_day;

        const reservation = new Reservation({
            user: userId,
            vehicle: vehicleId,
            startDate: start,
            endDate: end,
            totalPrice,
            cin,
            phone,
            options,
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
        const status = req.body.status?.trim();

        console.log(`Updating reservation ${id} to status: [${status}] (type: ${typeof status})`);

        if (!["pending", "accepted", "refused", "cancelled"].includes(status)) {
            console.log("Validation failed for status:", status);
            return res.status(400).json({ message: "Invalid status - debug" });
        }

        const reservation = await Reservation.findById(id).populate("vehicle");

        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        // Check ownership for Agency Admin
        const isAdminRole = req.user.role === "admin" || req.user.role === "admin_agency";
        if (isAdminRole) {
            // Ensure the vehicle belongs to the admin's agency
            if (!req.user.agency || reservation.vehicle.agency.toString() !== req.user.agency) {
                return res.status(403).json({ message: "Not authorized to manage this reservation" });
            }
        }

        reservation.status = status;
        await reservation.save();

        res.json({ message: `Reservation ${status}`, reservation });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get Reservations (User: own, Admin: all for their agency?)
exports.getReservations = async (req, res) => {
    try {
        let query = {};

        if (req.user.role === "user") {
            // User sees only their own reservations
            query.user = req.user.id;
        } else if (req.user.role === "admin" || req.user.role === "admin_agency") {
            // Agency Admin sees reservations for their vehicles only
            if (!req.user.agency) {
                return res.status(403).json({ message: "Agency not associated with this admin account" });
            }

            // Find all vehicles for this agency
            const vehicles = await Vehicle.find({ agency: req.user.agency }).select("_id");
            const vehicleIds = vehicles.map(v => v._id);

            query.vehicle = { $in: vehicleIds };
        } else if (req.user.role === "super" || req.user.role === "admin_super") {
            // Super admin sees all (or could implement further filtering if needed)
        }

        const reservations = await Reservation.find(query)
            .populate("vehicle")
            .populate("user", "nom prenom email"); // Secure user data

        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
