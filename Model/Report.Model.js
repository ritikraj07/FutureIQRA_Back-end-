const { Schema, model } = require('mongoose')

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


const Report = model('Report', ReportSchema)

module.exports = Report