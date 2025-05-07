const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const orderController = require('../controllers/orderController');

/**
 * Create a checkout session with Stripe
 * @route GET /api/payments/create-payment-intent/:orderId
 */
const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the existing order
    const order = await Order.findById(orderId).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: 'Order already paid' });
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: order.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            images: [item.product.image],
          },
          unit_amount: Math.round(item.product.price * 100), // Amount in cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:4200'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:4200'}/cart`,
      metadata: {
        orderId: order._id.toString()
      },
    });

    res.status(200).json({
      url: session.url,
      sessionId: session.id
    });
  } catch (e){
    console.error('Error creating payment intent:', e);
    return res.status(500).json({ message: e.message });
  }
};

/**
 * Verify session status
 * @route GET /api/payments/verify-session/:sessionId
 */
const confirmPayment = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    // Retrieve the checkout session to verify payment status
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ 
        message: 'Payment not successful',
        status: session.payment_status
      });
    }

    // Find the order using metadata
    const orderId = session.metadata.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // If the order is not already marked as paid by the webhook
    if (!order.isPaid) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: session.id,
        status: session.payment_status,
        update_time: new Date(),
        email_address: session.customer_details?.email || ''
      };

      await order.save();
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Handle Stripe webhook events
 * @route POST /api/payments/webhook
 */
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      event = req.body;
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata.orderId;

      if (orderId) {
        const order = await Order.findById(orderId);
        if (order && !order.isPaid) {
          order.isPaid = true;
          order.paidAt = new Date();
          order.paymentResult = {
            id: session.id,
            status: session.payment_status,
            update_time: new Date(),
            email_address: session.customer_details?.email || ''
          };
          await order.save();
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * Get payment methods for a user
 * @route GET /api/payments/methods/:userId
 */
const getPaymentMethods = async (req, res) => {
  try {
    // This would typically involve retrieving saved payment methods from Stripe
    // For simplicity, we're just returning a success message
    res.status(200).json({ 
      message: 'Payment methods would be retrieved here',
      methods: [] 
    });
  } catch (error) {
    console.error('Error getting payment methods:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  handleWebhook,
  getPaymentMethods
};
