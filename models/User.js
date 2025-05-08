const { selectFields } = require('express-validator/lib/field-selection');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default:'pending'
    },
    repassword: {
        type: String,
        
    },
   
    verified: {
        type: Boolean,
        default: false
    },
    verifiedCode: {
        type: String,
        select:false
    },
    verifiedCodeVaildation: {
        type: Number,
        select:false
    },
    forgetpasswordCode: {
        type: String,
        select:false
    },
    forgetPasswordVaildation: {
        type: Number,
        select :false
    },
    profileImage: {
        type: String,
        default:"/uploads/profile.png",
        select:false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);