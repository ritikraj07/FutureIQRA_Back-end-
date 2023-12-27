const { Schema, model } = require('mongoose')

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

const Question = model('Question', QuestionSchema)

module.exports = Question