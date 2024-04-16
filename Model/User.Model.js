const { Schema, model } = require('mongoose');

const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    wallet: {
        type: Number,
        default: 100
    },
    image: {
        type: String,
        default: 'https://futureiqra.onrender.com/avatar/1'
    },
    password: {
        type: String,
        required: true
    },
    referby: {
        type: String,
        // default: '070707'
    },
    referCode: {
        type: String,
        unique: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    userType: {
        type: String,
        default: 'Basic',
        enum: ['Basic', 'VIP1', 'VIP2'], // Array defining allowed values for userType
        required: true // Indicates that userType is required
    },
    email: {
        type: String,
        unique: true,
    },

}, {
    timestamps: true
});

UserSchema.plugin(mongoosePaginate)
const User = model('User', UserSchema);

module.exports = User;
