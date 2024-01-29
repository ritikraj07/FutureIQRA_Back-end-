const {Schema, model} = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const PaymentModel = new Schema({
    phone: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
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
  

    paymentMode: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    expireTime: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});


PaymentModel.plugin(mongoosePaginate)

const Payment = model('Payment', PaymentModel)

module.exports = Payment;