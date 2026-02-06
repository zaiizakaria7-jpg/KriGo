const express = require("express");
const router = express.Router();
const controller = require("../controllers/payment.controller");
const { isAuth } = require("../middlewares/auth.middleware");
const { isAgency } = require("../middlewares/role.middleware");

// ============================================
// STRIPE ROUTES
// ============================================
router.post("/stripe/create", isAuth, controller.createStripePayment);
router.post("/stripe/confirm", isAuth, controller.confirmStripePayment);

// ============================================
// PAYPAL ROUTES
// ============================================
router.post("/paypal/create", isAuth, controller.createPayPalOrder);
router.post("/paypal/capture", isAuth, controller.capturePayPalPayment);

// ============================================
// CASH ROUTES
// ============================================
router.post("/cash/create", isAuth, controller.createCashPayment);
router.patch("/cash/:paymentId/confirm", isAuth, isAgency, controller.confirmCashPayment);

// ============================================
// GENERAL ROUTES
// ============================================
router.get("/reservation/:reservationId", isAuth, controller.getPaymentByReservation);
router.get("/my-payments", isAuth, controller.getUserPayments);
router.get("/all", isAuth, isAgency, controller.getAllPayments);

module.exports = router;
