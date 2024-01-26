const { model, Schema } = require('mongoose')

const WithdrawModel = new Schema({
    userId: {
        type: String, 
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Success', 'Failed'],
        default: 'Pending'
    },
    amount: {
        type: Number,
        required: true
    },
    upi_Id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }


}, { timeseries: true })

const Withdraw = model('Withdraw', WithdrawModel)

module.exports = Withdraw;