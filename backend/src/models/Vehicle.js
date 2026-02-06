const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["car", "moto", "trottinette"],
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    price_per_day: {
        type: Number,
        required: true
    },
    availability: {
        type: Boolean,
        default: true
    },
    agency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agency",
        required: true
    },
    image: {
        type: String
    },
    description: String
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);
