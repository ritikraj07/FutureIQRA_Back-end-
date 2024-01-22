const { Schema, model } = require('mongoose');


const Payment = new Schema({
    transactionId: {
        type: Number,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    merchant: {
        id: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        vpa: {
            type: String,
            required: true
        }
    },
    transactionDate: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },

    product: {

        type: String,
        required: true

    },
    customer_email: {
        type: String,
        required: true
    },
    bank: {
        orderId: {
            type: String,
            required: true
        },
        utrNumber: {
            type: Number,
            required: true
        }
    },
    paymentMode: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    expireTime: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});


const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    wallet: {
        type: Number,
        default: 100
    },
    image: {
        type: String,
        default: 'https://6570556c9c603163391e8ba0--joyful-kheer-008761.netlify.app/Avatar/avatar1.jpg'
    },
    password: {
        type: String,
        required: true
    },
    referby: {
        type: String,
        default: '070707'
    },
    referCode: {
        type: String
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
        type: String
    },
    paymentHistory: [Payment]
}, {
    timestamps: true
});

const User = model('User', UserSchema);

module.exports = User;
