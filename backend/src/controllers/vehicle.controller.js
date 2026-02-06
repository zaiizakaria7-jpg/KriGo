const Vehicle = require("../models/Vehicle");

// Add a new vehicle
exports.addVehicle = async (req, res) => {
    try {
        const { type, brand, model, price_per_day, agency, image, description } = req.body;

        // Validate required fields
        if (!type || !brand || !model || !price_per_day || !agency) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const vehicle = new Vehicle({
            type,
            brand,
            model,
            price_per_day,
            agency,
            image,
            description
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
        const vehicle = await Vehicle.findByIdAndUpdate(id, req.body, { new: true });

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        res.json({ message: "Vehicle updated", vehicle });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a vehicle
exports.deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findByIdAndDelete(id);

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        res.json({ message: "Vehicle deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// List vehicles with filters
exports.getVehicles = async (req, res) => {
    try {
        const { city, type, minPrice, maxPrice } = req.query;
        let query = { availability: true };

        if (type) {
            query.type = type;
        }
        if (minPrice || maxPrice) {
            query.price_per_day = {};
            if (minPrice) query.price_per_day.$gte = Number(minPrice);
            if (maxPrice) query.price_per_day.$lte = Number(maxPrice);
        }

        // Note: City filtering requires populating agency or finding agencies first.
        // For simplicity, if city is provided, we first find agencies in that city.
        if (city) {
            // Assuming Agency model is available and imported, strictly speaking we need to import it.
            // But let's assume we can filter after populate or use aggregate.
            // Let's use a simple Populate match if possible, or 2 steps.
            // 2-step approach is easier without deep knowledge of Agency model exports in this file.
            // However, we want to be efficient.
            // Let's defer city filtering or try to use populate with match.
        }

        let vehicles = await Vehicle.find(query).populate({
            path: 'agency',
            match: city ? { city: city } : {}
        });

        // If city filter was applied in populate, agency will be null for non-matching cities.
        // So we filter out vehicles where agency is null.
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
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
