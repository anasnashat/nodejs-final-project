const Wishlist = require("../models/WishList");
const Product = require("../models/Product");

// Define the function properly before exporting it
const getUserWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");

    if (!wishlist) {
      return res.status(404).json({ message: "No items found in wishlist." });
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving the wishlist." });
  }
};

// Make sure all functions are correctly declared BEFORE exporting
const addToWishlist = async (req, res) => {
    try {
        const productId = req.body.productId;

        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ message: "Product not found" });
        }

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user._id, products: [productId] });
        } else {
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
            } else {
                return res.status(400).json({ message: "Product is already in the wishlist" });
            }
        }

        await wishlist.save();
        res.status(201).json({ message: "Product added to wishlist successfully!", wishlist });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while adding the product." });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const productId = req.body.productId;
        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            return res.status(404).json({ message: "No wishlist found for the user." });
        }

        wishlist.products = wishlist.products.filter(prod => prod.toString() !== productId);
        await wishlist.save();

        res.json({ message: "Product removed from wishlist successfully!", wishlist });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while removing the product." });
    }
};

// Export the functions correctly
module.exports = {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
};
