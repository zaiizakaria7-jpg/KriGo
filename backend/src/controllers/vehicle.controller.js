const Vehicle = require("../models/Vehicle");
const Reservation = require("../models/Reservation");

// Add a new vehicle
exports.addVehicle = async (req, res) => {
    try {
        const { type, brand, model, price_per_day, agency, image, description, specs } = req.body;

        // Force agency ID if not super admin
        let agencyId = agency;
        if (req.user.role === 'admin' || req.user.role === 'admin_agency') {
            agencyId = req.user.agency;
        }

        // Validate required fields
        if (!type || !brand || !model || !price_per_day) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const vehicle = new Vehicle({
            type,
            brand,
            model,
            price_per_day,
            agency: agencyId,
            image,
            description,
            specs
        });

        await vehicle.save();
        res.status(201).json({ message: "Vehicle added successfully", vehicle });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a vehicle
exports.updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;

        let vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Check ownership
        const isAdminRole = req.user.role === 'admin' || req.user.role === 'admin_agency';
        if (isAdminRole && vehicle.agency.toString() !== req.user.agency) {
            return res.status(403).json({ message: "Not authorized to update this vehicle" });
        }

        vehicle = await Vehicle.findByIdAndUpdate(id, req.body, { new: true });

        res.json({ message: "Vehicle updated", vehicle });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a vehicle
exports.deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;

        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Check ownership
        const isAdminRole = req.user.role === 'admin' || req.user.role === 'admin_agency';
        if (isAdminRole && vehicle.agency.toString() !== req.user.agency) {
            return res.status(403).json({ message: "Not authorized to delete this vehicle" });
        }

        await Vehicle.findByIdAndDelete(id);

        res.json({ message: "Vehicle deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// List vehicles with filters
exports.getVehicles = async (req, res) => {
    try {
        const { city, type, minPrice, maxPrice, availability, search, agency } = req.query;
        let query = {};

        if (agency) {
            query.agency = agency;
        }

        // Only enforce availability if explicitly requested or true by default if you want
        // But frontend Logic might want to show unavailable ones slightly differently.
        if (availability === 'true') {
            query.availability = true;
        }

        if (type && type !== 'all') {
            query.type = type;
        }

        if (minPrice || maxPrice) {
            query.price_per_day = {};
            if (minPrice) query.price_per_day.$gte = Number(minPrice);
            if (maxPrice) query.price_per_day.$lte = Number(maxPrice);
        }

        if (search) {
            query.$or = [
                { brand: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        let vehicles = await Vehicle.find(query).populate({
            path: 'agency',
            match: city ? { city: { $regex: city, $options: 'i' } } : {}
        });

        if (city) {
            vehicles = vehicles.filter(v => v.agency !== null);
        }

        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get single vehicle
exports.getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate("agency");
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Get unavailable dates based on reservations
        const reservations = await Reservation.find({
            vehicle: req.params.id,
            status: { $in: ["pending", "accepted"] },
            endDate: { $gte: new Date() } // Only future or current reservations
        });

        const unavailableDates = [];
        reservations.forEach(res => {
            let current = new Date(res.startDate);
            const end = new Date(res.endDate);
            // Iterate from start to end
            while (current <= end) {
                unavailableDates.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }
        });

        res.json({ ...vehicle.toObject(), unavailableDates });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
