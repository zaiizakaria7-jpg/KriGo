const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    reservation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reservation",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "MAD" 
    },
    method: {
        type: String,
        enum: ["stripe", "paypal", "cash"],
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending"
    },
    transactionId: {
        type: String 
    },
    paypalOrderId: {
        type: String
    },
    stripePaymentIntentId: {
        type: String
    },
    paidAt: {
        type: Date
    },
    metadata: {
        type: Object // Additional payment info
    }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
