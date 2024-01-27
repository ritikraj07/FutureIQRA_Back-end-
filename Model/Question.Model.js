const { Schema, model } = require('mongoose')
const mongoosePaginate = require("mongoose-paginate-v2");
const QuestionSchema = new Schema({
    question: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    answer: {
        type: String,
        default: 'Add Your Answer'
    },
    liked: [{
        type: String,
        default:false
    }]
}, {
    timestamps: true
})

QuestionSchema.plugin(mongoosePaginate)
const Question = model('Question', QuestionSchema)

module.exports = Question