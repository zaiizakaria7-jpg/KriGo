const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "refused", "cancelled"],
        default: "pending"
    },
    totalPrice: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Reservation", reservationSchema);
