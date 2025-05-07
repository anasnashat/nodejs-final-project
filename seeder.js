const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./models/Category');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const User = require('./models/User');

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    // await User.create([
    //     {
    //         'name':'admin',
    //         'email':'admin@admin.com',
    //         'password':'admin',
    //         'repassword': "admin",
    //         'role':'admin'
    //     }
    // ]);
    await Product.create([
        { name: 'Nike Air Max', description: "Shoes", price: 100, category: "681bdf4980869658b62bbec1", image: "test", stock: 10 },
        { name: 'Adidas Ultraboost', description: "Shoes", price: 120, category: "681bdf4980869658b62bbec1", image: "test", stock: 15 },
        { name: 'Puma RS-X', description: "Shoes", price: 90, category: "681bdf4980869658b62bbec1", image: "Shoes", stock: 20 },
        { name: 'Reebok Classic', description: "Shoes", price: 80, category: "681bdf4980869658b62bbec1", image: "test", stock: 25 },
    ]);
    // await Category.create([
    //     { name: 'Shoes', description: "test", image: "test" },
    //     { name: 'Watch', description: "test", image: "test" },
    // ]);

    // await Cart.create([
    //     { user: "681652c48394f14b8eeb5998", products: [{ product: "68164d0eb87894386590473a", quantity: 2 }] },
    //     { user: "681652c48394f14b8eeb5998", products: [{ product: "68164d0eb87894386590473a", quantity: 1 }] },
    //     { user: "681652c48394f14b8eeb5998", products: [{ product: "68164d0eb87894386590473a", quantity: 3 }] },
    //     { user: "681652c48394f14b8eeb5998", products: [{ product: "68164d0eb87894386590473a", quantity: 4 }] },
    // ]);
    console.log('🌱 Seeded');
    process.exit();
};

seed();
