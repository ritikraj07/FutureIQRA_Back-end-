const { Router } = require('express')
const { VerifyUser, VerifyAdmin } = require('../Middleware/Auth.Middleware')
const { AllData } = require('../Controller/Admin.Controller')

const AdminRoute = Router()

AdminRoute.get('/all', async (req, res) => {
    let response = await AllData()
    res.send(response)
})


module.exports = AdminRoute