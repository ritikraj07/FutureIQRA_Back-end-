const { Router } = require('express')
const { CreateUser, FindUser, Login, GetUser, GetLeadersBoard, GetAllUser, UpdateUser, ResetPassword } = require('../Controller/User.Controller')
const {VerifyUser, VerifyAdmin} = require('../Middleware/Auth.Middleware')

const UserRouter = Router()

/**************************************** POST ******************************************/


UserRouter.post('/create-account', async (req, res) => {
    let {name, phone, referby, password} = req.body
    let user = await CreateUser({ name, phone, referby, password })
    res.send(user)
})






/**************************************** GET ******************************************/

UserRouter.get('/phone/:phone', async (req, res) => {
    let phone = req.params.phone
    let result = await FindUser(phone)
    res.send(result)
})



UserRouter.get('/token/:token',VerifyUser, async (req, res) => {
    let { phone } = req.user
    let result = await GetUser(phone)
    res.send(result)
})


UserRouter.get('/login/:phone/:password', async (req, res) => {
    
    let { phone, password } = req.params
    let result = await Login(phone, password)
    
    res.send(result);
});



UserRouter.get('/leaderboard', async (req, res) => {
    
    let result = await GetLeadersBoard()
    res.send(result)
})

UserRouter.get('/all', async (req, res) => {
    let users = await GetAllUser()
    res.send(users)
})

/**************************************** PATCH ******************************************/

UserRouter.patch('/update-photo', VerifyUser, async (req, res) => {
    let {_id, image} = req.body
    let result = await UpdateUser({ _id, image })
    res.send(result)
})

UserRouter.patch('/update-user', VerifyUser, VerifyAdmin, async (req, res) => {
    let data = req.body
    let result = await UpdateUser(data)
    res.send(result)
})

UserRouter.patch('/reset-password', async (req, res) => {
    let { phone, password } = req.body
    let result = await ResetPassword({ phone, password })
    res.send(result)
})

module.exports = UserRouter