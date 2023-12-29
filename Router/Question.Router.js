const { Router } = require('express')
const {VerifyUser} = require('../Middleware/Auth.Middleware')
const { PostAnswer, PostQuestion, DeleteQuestion, GetQuestionById, AddLike, GetAllQuestion, SearchQuestion } = require('../Controller/Question.Controller')

const QuestionRouter = Router()

/****************************************POST ******************************************/
QuestionRouter.post('/', VerifyUser ,async (req, res) => {
    let {question, answer} = req.body
    let {phone} = req.user.data
    console.log('===>', req.user.data)
    let data = await PostQuestion({question, phone, answer})
    res.send(data)
    
})


/**************************************** GET ******************************************/

QuestionRouter.get('/search', async (req, res) => {
    const { q, sort } = req.query
    console.log('/ search get ==>', q, sort)
    let result = await SearchQuestion({q, sort})
    
    res.send(result)
})

QuestionRouter.get('/all/', async (req, res) => {
    
    let question = await GetAllQuestion()
    res.send(question)
})


QuestionRouter.get('/:id', VerifyUser ,async (req, res) => {
    let id = req.params.id
    let question = await GetQuestionById(id)
    res.send(question)
})


/**************************************** PATCH ******************************************/


QuestionRouter.patch('/id/:id', VerifyUser ,async (req, res) => {
    let {answer} = req.body
    let _id = req.params.id
    let data = await PostAnswer({ _id, answer })
    res.send(data)
})

QuestionRouter.patch('/like/:question_id', VerifyUser, async (req, res) => {
    
    let { question_id } = req.params
    let {phone} = req.user.data
    console.log('phone', phone)
    let data = await AddLike({ question_id, phone })
    res.send(data)  
})


/**************************************** DELETE ******************************************/

QuestionRouter.delete('/:id',VerifyUser,async (req, res) => {
    let id = req.params.id
    let data = await DeleteQuestion(id)
    res.send(data)
})


module.exports = QuestionRouter