const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');
// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body;

    // Handle image and slider images
    const mainImage = req.files['image']?.[0]?.filename;
    const sliderImages = req.files['sliderImages']?.map(file => file.filename) || [];

    const product = await Product.create({
      name,
      price,
      image: mainImage,
      sliderImages,
      description,
      category,
      stock
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');

    // Add full image URLs for frontend display
    const productsWithImageUrls = products.map(product => ({
      ...product.toObject(),
      imageUrl: `http://localhost:5000/uploads/${product.image}`,
      sliderImageUrls: product.sliderImages.map(image => `http://localhost:5000/uploads/${image}`)
    }));

    res.json(productsWithImageUrls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single product with related products
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Get related products from the same category (excluding current product)
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id }
    }).limit(4); // limit to 4 related

    const formattedProduct = {
      ...product.toObject(),
      imageUrl: `http://localhost:5000/uploads/${product.image}`,
      sliderImageUrls: product.sliderImages.map(image => `http://localhost:5000/uploads/${image}`)
    };

    const formattedRelated = relatedProducts.map(p => ({
      ...p.toObject(),
      imageUrl: `http://localhost:5000/uploads/${p.image}`,
      sliderImageUrls: p.sliderImages.map(img => `http://localhost:5000/uploads/${img}`)
    }));

    res.json({
      product: formattedProduct,
      relatedProducts: formattedRelated
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update product
// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Update main image if uploaded
    if (req.files['image']) {
      product.image = req.files['image'][0].filename;
    }

    // Append new slider images
    if (req.files && req.files['sliderImages'] && req.files['sliderImages'].length > 0) {
      const newSliderImages = req.files['sliderImages'].map(file => file.filename);
      product.sliderImages = [...new Set([...product.sliderImages, ...newSliderImages])];
    }
    
    

    // Update other fields
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.stock = stock;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};








// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete image and slider images
    if (product.image) {
      const imagePath = path.join(__dirname, '..', 'uploads', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    product.sliderImages.forEach(sliderImage => {
      const sliderImagePath = path.join(__dirname, '..', 'uploads', sliderImage);
      if (fs.existsSync(sliderImagePath)) {
        fs.unlinkSync(sliderImagePath);
      }
    });

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
