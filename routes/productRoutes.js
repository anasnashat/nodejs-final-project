const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../utils/upload');

// Create product - expecting fields: image (main), sliderImages[] (multiple)
router.post('/', 
  upload.fields([
    { name: 'image', maxCount: 1 },   // Main image
    { name: 'sliderImages', maxCount: 5 }  // Multiple slider images
  ]), 
  productController.createProduct
);

// Get all products
router.get('/', productController.getAllProducts);

// Get a single product
router.get('/:id', productController.getProductById);

// Update product
router.put('/:id', 
  upload.fields([
    { name: 'image', maxCount: 1 },   // Main image
    { name: 'sliderImages', maxCount: 5 }  // Multiple slider images
  ]), 
  productController.updateProduct
);

// Delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
