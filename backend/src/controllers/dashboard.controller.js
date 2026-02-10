const Vehicle = require("../models/Vehicle");
const Reservation = require("../models/Reservation");
const Agency = require("../models/Agency");
const User = require("../models/user");

exports.getStats = async (req, res) => {
    try {
        const { role, agency } = req.user;
        let vehiclesCount = 0;
        let reservationsCount = 0;
        let revenue = 0;
        let pendingCount = 0;
        let acceptedCount = 0;
        let monthlyRevenue = [];
        let recentReservations = [];
        let agenciesCount = 0;
        let adminUsersCount = 0;

        const isSuper = role === 'super' || role === 'admin_super';
        const isAdminRole = role === 'admin' || role === 'admin_agency';

        if (isSuper) {
            // Super Admin sees ALL stats
            vehiclesCount = await Vehicle.countDocuments();
            reservationsCount = await Reservation.countDocuments();
            agenciesCount = await Agency.countDocuments();
            adminUsersCount = await User.countDocuments({
                role: { $in: ['admin', 'super', 'admin_super', 'admin_agency'] }
            });

            const revenueAggregation = await Reservation.aggregate([
                { $match: { status: "accepted" } },
                { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
            ]);
            revenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

            pendingCount = await Reservation.countDocuments({ status: "pending" });
            acceptedCount = await Reservation.countDocuments({ status: "accepted" });

            // Monthly Revenue
            monthlyRevenue = await Reservation.aggregate([
                { $match: { status: "accepted" } },
                {
                    $group: {
                        _id: { $month: "$startDate" },
                        revenue: { $sum: "$totalPrice" }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            // Recent Reservations
            recentReservations = await Reservation.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('vehicle', 'brand model');

        } else if (isAdminRole && agency) {
            // Agency Admin sees only THEIR stats
            const agencyVehicles = await Vehicle.find({ agency: agency }).select('_id');
            const agencyVehicleIds = agencyVehicles.map(v => v._id);

            vehiclesCount = agencyVehicles.length;

            reservationsCount = await Reservation.countDocuments({
                vehicle: { $in: agencyVehicleIds }
            });

            const revenueAggregation = await Reservation.aggregate([
                {
                    $match: {
                        status: "accepted",
                        vehicle: { $in: agencyVehicleIds }
                    }
                },
                { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
            ]);
            revenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

            pendingCount = await Reservation.countDocuments({
                vehicle: { $in: agencyVehicleIds },
                status: "pending"
            });
            acceptedCount = await Reservation.countDocuments({
                vehicle: { $in: agencyVehicleIds },
                status: "accepted"
            });

            // Monthly Revenue
            monthlyRevenue = await Reservation.aggregate([
                {
                    $match: {
                        status: "accepted",
                        vehicle: { $in: agencyVehicleIds }
                    }
                },
                {
                    $group: {
                        _id: { $month: "$startDate" },
                        revenue: { $sum: "$totalPrice" }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            // Recent Reservations
            recentReservations = await Reservation.find({ vehicle: { $in: agencyVehicleIds } })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('vehicle', 'brand model');
        }

        // Format Monthly Revenue for Frontend
        const formattedMonthlyRevenue = monthlyRevenue.map(item => ({
            month: new Date(0, item._id - 1).toLocaleString('default', { month: 'short' }),
            revenue: item.revenue
        }));

        res.json({
            vehiclesCount,
            reservationsCount,
            revenue,
            pendingCount,
            acceptedCount,
            monthlyRevenue: formattedMonthlyRevenue,
            recentReservations,
            agenciesCount,
            adminUsersCount,
            totalCustomersCount: await User.countDocuments({ role: 'user' }),
            recentLogins: await User.find({ lastLogin: { $exists: true } })
                .sort({ lastLogin: -1 })
                .limit(5)
                .select('nom prenom email lastLogin')
        });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getActivity = async (req, res) => {
    try {
        const { role, agency } = req.user;
        const isSuper = role === 'super' || role === 'admin_super';
        const isAdminRole = role === 'admin' || role === 'admin_agency';
        let query = {};

        if (isAdminRole && agency) {
            const agencyVehicles = await Vehicle.find({ agency }).select('_id');
            const vehicleIds = agencyVehicles.map(v => v._id);
            query.vehicle = { $in: vehicleIds };
        }

        // Get recent reservations as "activity"
        const recentReservations = await Reservation.find(query)
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('user', 'nom prenom')
            .populate('vehicle', 'brand model');

        const activityLogs = recentReservations.map(res => ({
            _id: res._id,
            userName: res.user ? `${res.user.prenom} ${res.user.nom}` : "Unknown User",
            action: `Created reservation`,
            target: `${res.vehicle?.brand} ${res.vehicle?.model}`,
            timestamp: res.createdAt
        }));

        // If super admin, add recent users and recent logins
        if (isSuper) {
            const recentUsers = await User.find()
                .sort({ createdAt: -1 })
                .limit(10);

            const userLogs = recentUsers.map(u => ({
                _id: u._id + "_reg",
                userName: "System",
                action: "New User Registration",
                target: u.email,
                timestamp: u.createdAt
            }));

            const recentLogins = await User.find({ lastLogin: { $exists: true } })
                .sort({ lastLogin: -1 })
                .limit(10);

            const loginLogs = recentLogins.map(u => ({
                _id: u._id + "_login",
                userName: u.prenom ? `${u.prenom} ${u.nom}` : u.email,
                action: "Logged in",
                target: "Account Access",
                timestamp: u.lastLogin
            }));

            activityLogs.push(...userLogs, ...loginLogs);
        }

        // Sort combined logs
        activityLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.json(activityLogs.slice(0, 30)); // Return top 30 logs
    } catch (error) {
        console.error("Activity Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
