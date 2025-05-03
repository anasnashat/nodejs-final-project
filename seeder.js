const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./models/Category');
const Product = require('./models/Product');

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.create([
        { name: 'Nike Air Max', description: "test", price: 100, category: "test", image: "test", stock: 10 },
        { name: 'Adidas Ultraboost', description: "test", price: 120, category: "test", image: "test", stock: 15 },
        { name: 'Puma RS-X', description: "test", price: 90, category: "test", image: "test", stock: 20 },
        { name: 'Reebok Classic', description: "test", price: 80, category: "test", image: "test", stock: 25 },
    ]);
    await Category.create([
        { name: 'Shoes', description: "test", image: "test" },
        { name: 'Watch', description: "test", image: "test" },
    ]);
    console.log('🌱 Seeded');
    process.exit();
};

seed();
