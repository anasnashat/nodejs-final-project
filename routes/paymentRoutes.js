const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifiyUser } = require('../middlewares/authMiddleware');

// Create a checkout session
router.get('/create-payment-intent/:orderId', paymentController.createPaymentIntent);

// Verify session status
router.get('/verify-session/:sessionId', paymentController.confirmPayment);

// Handle Stripe webhooks
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

// Get payment methods for a user
router.get('/methods/:userId', verifiyUser, paymentController.getPaymentMethods);

module.exports = router;
