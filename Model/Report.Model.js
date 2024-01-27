const { Schema, model } = require('mongoose')
const mongoosePaginate = require("mongoose-paginate-v2");
const ReportSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    report: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    subject: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
}, {
    timestamps: true
})
 
 ReportSchema.plugin(mongoosePaginate)

const Report = model('Report', ReportSchema)

module.exports = Report