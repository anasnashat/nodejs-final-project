const mongoose = require("mongoose")
const {now} = require("mongoose");


const OrderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items:[
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity : {
                    type: Number,
                    required: true
                }
            },
    ],
    totalPrice:{
        type:Number,
        required:true,
    },
    status:{
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: "pending"
    },
    paymentMethod: {
            type: String,
            enum: ['cash', 'card', 'paypal'],
            required: true
    },
    isPaid:{
        type:Boolean,
        default: false,
    },
    paidAt:{
        type: Date,
    },
    shippingAddress: {
        fullName: String,
        phone: String,
        address: String,
        city: String,
        postalCode: String,
        country: String
    }
}, {timestamps:true}

);


module.exports = mongoose.model('Order', OrderSchema);