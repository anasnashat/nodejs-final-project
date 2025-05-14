const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { verifiyUser } = require("../middlewares/authMiddleware");

/**
 * @route   GET /api/cart
 * @desc    Get user's cart
 * @access  Private
 */
router.get("/", verifiyUser, cartController.getCart);

/**
 * @route   POST /api/cart
 * @desc    Add product to cart
 * @access  Private
 */
router.post("/", verifiyUser, cartController.addToCart);

/**
 * @route   PUT /api/cart
 * @desc    Update product quantity in cart
 * @access  Private
 */
router.put("/", verifiyUser, cartController.updateCart);

/**
 * @route   DELETE /api/cart
 * @desc    Clear entire cart
 * @access  Private
 */
router.delete("/", verifiyUser, cartController.deleteCart);

/**
 * @route   DELETE /api/cart/:productId
 * @desc    Remove specific product from cart
 * @access  Private
 */
router.delete("/:productId", verifiyUser, cartController.removeFromCart);

module.exports = router;
