const { Schema, model } = require('mongoose')


const PaymentStatusSchema = new Schema({
    status: Boolean,
    message: String,
    order_id: String,
}, {
    timestamps:true
})


const PaymentStatus = model('PaymentStatus', PaymentStatusSchema)

