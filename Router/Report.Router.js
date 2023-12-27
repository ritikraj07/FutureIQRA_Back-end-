const { Router } = require('express')
const {VerifyUser} = require('../Middleware/Auth.Middleware')
const { PostReport, GetAllReport, DeleteReports } = require('../Controller/Report.Controller')

const ReportRouter = Router()

/**************************************** POST ******************************************/

ReportRouter.post('/', VerifyUser ,async (req, res) => {
    let { report, email, subject } = req.body
    let {name, phone} = req.user.data
    console.log({ name, report, email, subject, phone })
    let result = await PostReport({ name, report, email, subject, phone })
    res.send(result)
})

/**************************************** GET ******************************************/

ReportRouter.get('/all', VerifyUser, async (req, res) => {
    let  {isAdmin}  = req.user.data
    console.log("==>" ,isAdmin, Date.toString())
    if (isAdmin) {
        let result = await GetAllReport()
        res.send(result)
    }
    else {
        res.send({
            status: false,
            data:'You are not an Admin dude 😊!'
        })
    }

})

ReportRouter.get('/:id', async (req, res) => {
    
})

ReportRouter.get('/search/', async (req, res) => {
    
})

/**************************************** PATCH ******************************************/

/**************************************** DELETE ******************************************/

ReportRouter.delete('/delete',VerifyUser ,async (req, res) => {
    let { isAdmin } = req.user.data
    // console.log("==>", isAdmin, Date.toString())
    if (isAdmin) {
        let {deleting_ids} = req.body
        let result = await DeleteReports({deleting_ids})
        res.send(result)
    }
    else {
        res.send({
            status: false,
            data: 'You are not an Admin dude 😊!'
        })
    }
})




module.exports = ReportRouter