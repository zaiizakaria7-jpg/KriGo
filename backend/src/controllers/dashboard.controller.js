const Vehicle = require("../models/Vehicle");
const Reservation = require("../models/Reservation");

exports.getStats = async (req, res) => {
    try {
        const vehiclesCount = await Vehicle.countDocuments();
        const reservationsCount = await Reservation.countDocuments();

        // Calculate total revenue from accepted reservations
        const revenueAggregation = await Reservation.aggregate([
            { $match: { status: "accepted" } },
            { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
        ]);

        const revenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

        res.json({
            vehiclesCount,
            reservationsCount,
            revenue
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
