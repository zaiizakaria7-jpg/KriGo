const Payment = require("../models/Payment");
const Reservation = require("../models/Reservation");

// ============================================
// STRIPE PAYMENT
// ============================================

// Create Stripe Payment Intent
exports.createStripePayment = async (req, res) => {
    try {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
        const { reservationId } = req.body;

        // Find the reservation
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ success: false, message: "Reservation not found" });
        }

        // Check if already paid
        const existingPayment = await Payment.findOne({
            reservation: reservationId,
            status: "completed"
        });
        if (existingPayment) {
            return res.status(400).json({ success: false, message: "Reservation already paid" });
        }

        // Create Stripe PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(reservation.totalPrice * 100), // Stripe expects cents
            currency: "mad",
            metadata: {
                reservationId: reservationId,
                userId: req.user.id
            }
        });

        // Create payment record
        const payment = new Payment({
            reservation: reservationId,
            user: req.user.id,
            amount: reservation.totalPrice,
            method: "stripe",
            status: "pending",
            stripePaymentIntentId: paymentIntent.id
        });
        await payment.save();

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentId: payment._id
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Confirm Stripe Payment (webhook or manual confirmation)
exports.confirmStripePayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        // Update payment status
        payment.status = "completed";
        payment.paidAt = new Date();
        payment.transactionId = paymentIntentId;
        await payment.save();

        // Update reservation status
        await Reservation.findByIdAndUpdate(payment.reservation, { status: "accepted" });

        res.json({ success: true, message: "Payment confirmed", payment });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// ============================================
// PAYPAL PAYMENT
// ============================================

// Create PayPal Order
exports.createPayPalOrder = async (req, res) => {
    try {
        const { reservationId } = req.body;

        // Find the reservation
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ success: false, message: "Reservation not found" });
        }

        // Check if already paid
        const existingPayment = await Payment.findOne({
            reservation: reservationId,
            status: "completed"
        });
        if (existingPayment) {
            return res.status(400).json({ success: false, message: "Reservation already paid" });
        }

        // Get PayPal access token
        const auth = Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString("base64");

        const tokenResponse = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "grant_type=client_credentials"
        });
        const tokenData = await tokenResponse.json();

        // Create PayPal order
        const orderResponse = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${tokenData.access_token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [{
                    amount: {
                        currency_code: "USD", // PayPal Morocco uses USD
                        value: (reservation.totalPrice / 10).toFixed(2) // Convert MAD to USD (approximate)
                    },
                    description: `KriGo Vehicle Rental - Reservation #${reservationId}`
                }],
                application_context: {
                    return_url: `${process.env.FRONTEND_URL}/payment/success`,
                    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
                }
            })
        });
        const orderData = await orderResponse.json();

        // Create payment record
        const payment = new Payment({
            reservation: reservationId,
            user: req.user.id,
            amount: reservation.totalPrice,
            method: "paypal",
            status: "pending",
            paypalOrderId: orderData.id
        });
        await payment.save();

        // Find approval URL
        const approvalUrl = orderData.links.find(link => link.rel === "approve")?.href;

        res.json({
            success: true,
            orderId: orderData.id,
            approvalUrl: approvalUrl,
            paymentId: payment._id
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Capture PayPal Payment (after user approves)
exports.capturePayPalPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        const payment = await Payment.findOne({ paypalOrderId: orderId });
        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        // Get PayPal access token
        const auth = Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString("base64");

        const tokenResponse = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "grant_type=client_credentials"
        });
        const tokenData = await tokenResponse.json();

        // Capture the payment
        const captureResponse = await fetch(
            `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${tokenData.access_token}`,
                    "Content-Type": "application/json"
                }
            }
        );
        const captureData = await captureResponse.json();

        if (captureData.status === "COMPLETED") {
            // Update payment status
            payment.status = "completed";
            payment.paidAt = new Date();
            payment.transactionId = captureData.id;
            await payment.save();

            // Update reservation status
            await Reservation.findByIdAndUpdate(payment.reservation, { status: "accepted" });

            res.json({ success: true, message: "Payment captured successfully", payment });
        } else {
            payment.status = "failed";
            await payment.save();
            res.status(400).json({ success: false, message: "Payment capture failed", data: captureData });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// ============================================
// CASH PAYMENT
// ============================================

// Create Cash Payment (Pay on Delivery)
exports.createCashPayment = async (req, res) => {
    try {
        const { reservationId } = req.body;

        // Find the reservation
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ success: false, message: "Reservation not found" });
        }

        // Check if already has payment
        const existingPayment = await Payment.findOne({ reservation: reservationId });
        if (existingPayment) {
            return res.status(400).json({ success: false, message: "Payment already exists for this reservation" });
        }

        // Create cash payment record (pending until delivery)
        const payment = new Payment({
            reservation: reservationId,
            user: req.user.id,
            amount: reservation.totalPrice,
            method: "cash",
            status: "pending"
        });
        await payment.save();

        res.status(201).json({
            success: true,
            message: "Cash payment created. Pay when you receive the vehicle.",
            payment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Confirm Cash Payment (Agency confirms when cash received)
exports.confirmCashPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await Payment.findById(paymentId).populate({
            path: 'reservation',
            populate: { path: 'vehicle' }
        });

        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        if (payment.method !== "cash") {
            return res.status(400).json({ success: false, message: "This is not a cash payment" });
        }

        // Check Agency Ownership
        if (req.user.role === 'admin') {
            const agencyId = req.user.agency;
            const vehicleAgency = payment.reservation?.vehicle?.agency?.toString();

            if (!agencyId || vehicleAgency !== agencyId) {
                return res.status(403).json({ success: false, message: "Not authorized to confirm this payment" });
            }
        }

        // Update payment status
        payment.status = "completed";
        payment.paidAt = new Date();
        await payment.save();

        // Update reservation status
        await Reservation.findByIdAndUpdate(payment.reservation._id, { status: "accepted" });

        res.json({ success: true, message: "Cash payment confirmed", payment });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// ============================================
// GENERAL PAYMENT FUNCTIONS
// ============================================

// Get payment by reservation
exports.getPaymentByReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;
        const payment = await Payment.findOne({ reservation: reservationId })
            .populate("reservation")
            .populate("user", "name email");

        if (!payment) {
            return res.status(404).json({ success: false, message: "No payment found for this reservation" });
        }

        res.json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Get all payments for user
exports.getUserPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user.id })
            .populate("reservation")
            .sort({ createdAt: -1 });

        res.json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Get all payments (Admin)
exports.getAllPayments = async (req, res) => {
    try {
        const { status, method } = req.query;
        const { role, agency } = req.user;
        let query = {};

        if (status) query.status = status;
        if (method) query.method = method;

        // Agency Isolation
        if (role === 'admin' && agency) {
            const Vehicle = require("../models/Vehicle"); // Lazy load to avoid circular deps if any

            // 1. Find vehicles for this agency
            const vehicles = await Vehicle.find({ agency: agency }).select('_id');
            const vehicleIds = vehicles.map(v => v._id);

            // 2. Find reservations for these vehicles
            const reservations = await Reservation.find({ vehicle: { $in: vehicleIds } }).select('_id');
            const reservationIds = reservations.map(r => r._id);

            // 3. Filter payments by these reservations
            query.reservation = { $in: reservationIds };
        }

        const payments = await Payment.find(query)
            .populate({
                path: 'reservation',
                populate: { path: 'vehicle' }
            })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
