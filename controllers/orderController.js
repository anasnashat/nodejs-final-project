const Order = require('../models/Order');
const Cart = require('../models/Cart');


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
        // console.log(cart.items, paymentMethod, shippingAddress);
        const order = new Order({
            user: userId,
            items: cart.items,
            totalPrice: cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0),
            paymentMethod,
            shippingAddress,
        });
        // console.log(cart.items);
        await order.save();
        cart.items = [];
        await cart.save();
        return res.status(201).json(order);
    } catch (e){
        res.status(500).json({ message: e.message });
    }
}

module.exports = {
    getOrder,
    createOrder
}