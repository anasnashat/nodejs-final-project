const Order = require('../models/Order');
const Cart = require('../models/Cart');
const assert = require("node:assert");


const getOrder = async (req,res) => {

    const userId = req.params.userId;
    try {
        const orders = await Order.find({ user: userId }).populate('items.product');
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }
        return res.status(200).json(orders);
    } catch (e){
        res.status(500).json({ message: e.message });
    }

}


const createOrder = async (req, res) => {
    const userId = req.params.userId;
    try{
        const { paymentMethod, shippingAddress } = req.body;
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(404).json({ message: 'Cart not found Or empty' });
        }
        if (!paymentMethod || !shippingAddress || !shippingAddress.fullName) {
            return res.status(400).json({ message: 'Payment method and shipping address are required' });
        }

        // Calculate total price
        const totalPrice = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

        // Create order with appropriate payment status
        const order = new Order({
            user: userId,
            items: cart.items,
            totalPrice,
            paymentMethod,
            shippingAddress,
            // Only cash payments are marked as paid immediately
            // Card and PayPal payments will be marked as paid after payment confirmation
            isPaid: paymentMethod === 'cash',
            paidAt: paymentMethod === 'cash' ? new Date() : null,
        });

        await order.save();

        // Return different responses based on payment method
        if (paymentMethod === 'cash') {
            return res.status(201).json({
                order,
                message: 'Order created successfully with cash payment'
            });
        } else if (paymentMethod === 'card') {
            // For card payments, client needs to complete payment with Stripe
            return res.status(201).json({
                order,
                message: 'Order created successfully. Please complete payment.',
                nextStep: {
                    action: 'PAYMENT_REQUIRED',
                    endpoint: `/api/payments/create-payment-intent/${userId}`
                }
            });
        } else if (paymentMethod === 'paypal') {
            // For PayPal, similar flow but different endpoint would be used
            return res.status(201).json({
                order,
                message: 'Order created successfully. Please complete PayPal payment.',
                nextStep: {
                    action: 'PAYMENT_REQUIRED',
                    // This is a placeholder - PayPal integration would be separate
                    endpoint: `/api/payments/paypal/${order._id}`
                }
            });
        }
    } catch (e){
        res.status(500).json({ message: e.message });
    }
}


const updateOrder = async (req, res) => {
    const orderId = req.params.orderId;
    const { status, isPaid, paidAt, shippingAddress } = req.body;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Optional updates
        if (status) order.status = status;
        if (typeof isPaid === 'boolean') order.isPaid = isPaid;
        if (paidAt) order.paidAt = paidAt;
        if (shippingAddress) order.shippingAddress = shippingAddress;

        const updatedOrder = await order.save();
        return res.status(200).json(updatedOrder);

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};


const deleteOrder = async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const order = await Order.findByIdAndDelete(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json({ message: 'Order deleted successfully' });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = {
    getOrder,
    createOrder,
    deleteOrder,
    updateOrder
}
