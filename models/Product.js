// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  stock: { type: Number, required: true },
  image: { type: String },
  sliderImages: [String],
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
