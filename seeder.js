const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./models/Category');

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await Category.create([
        { name: 'Shoes', description: "test", image: "test" },
        { name: 'Watch', description: "test", image: "test" },
    ]);
    console.log('🌱 Seeded');
    process.exit();
};

seed();
