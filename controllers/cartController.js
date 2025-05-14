const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * Get the user's cart with populated product details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Cart with populated product details
 */
const getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        let cart = await Cart.findOne({ user: userId })
            .select('-__v')
            .populate('items.product');

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        return res.status(200).json(cart);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * Add a product to the user's cart
 * @param {Object} req - Express request object with productId and quantity in body
 * @param {Object} res - Express response object
 * @returns {Object} Updated cart
 */
const addToCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const { productId, quantity = 1 } = req.body;

        // Validate inputs
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        if (quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be greater than 0' });
        }

        // Find product and check stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock <= 0) {
            return res.status(400).json({ message: 'Product out of stock' });
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Check if product already exists in cart
        const existingItem = cart.items.find(item => item.product.toString() === productId);

        // Calculate new quantity and check against stock
        const newQuantity = (existingItem?.quantity || 0) + quantity;
        if (newQuantity > product.stock) {
            return res.status(400).json({ 
                message: 'Not enough stock available',
                available: product.stock,
                requested: newQuantity
            });
        }

        // Update cart
        if (existingItem) {
            existingItem.quantity = newQuantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        return res.status(201).json(cart);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * Update product quantity in cart or remove if quantity is 0
 * @param {Object} req - Express request object with productId and quantity in body
 * @param {Object} res - Express response object
 * @returns {Object} Updated cart
 */
const updateCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const { productId, quantity } = req.body;

        // Validate inputs
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        if (quantity === undefined) {
            return res.status(400).json({ message: 'Quantity is required' });
        }

        // Find cart
        const cart = await Cart.findOne({ user: userId });
        if (!cart || cart.items.length === 0) {
            return res.status(404).json({ message: 'Cart not found or empty' });
        }

        // Find item in cart
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (!existingItem) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Update or remove item
        if (quantity <= 0) {
            cart.items = cart.items.filter(item => item.product.toString() !== productId);
        } else {
            // Check stock availability
            const product = await Product.findById(productId);
            if (product && quantity > product.stock) {
                return res.status(400).json({ 
                    message: 'Not enough stock available',
                    available: product.stock,
                    requested: quantity
                });
            }

            existingItem.quantity = quantity;
        }

        await cart.save();
        return res.status(200).json(cart);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * Clear all items from the user's cart
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Empty cart
 */
const deleteCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();

        return res.status(200).json({ 
            message: 'Cart cleared successfully',
            cart
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * Remove a specific product from the cart
 * @param {Object} req - Express request object with productId in params
 * @param {Object} res - Express response object
 * @returns {Object} Updated cart
 */
const removeFromCart = async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.productId;

    try {
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Check if product exists in cart
        const initialItemCount = cart.items.length;
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        if (cart.items.length === initialItemCount) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        await cart.save();
        return res.status(200).json({ 
            message: 'Product removed from cart',
            cart
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCart,
    deleteCart,
    removeFromCart
};
