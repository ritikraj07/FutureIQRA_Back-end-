const { model, Schema } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
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


}, { timestamps: true })


WithdrawModel.plugin(mongoosePaginate)

const Withdraw = model('Withdraw', WithdrawModel)

module.exports = Withdraw;