const { VerifyToken } = require("../Controller/User.Controller")


async function VerifyUser(req, res, next) {
    try { 
        console.log( '=====>',req.headers)
        let headers = req.headers
        const authorization = headers.authorization
        if (authorization) {
            let token = authorization.split(' ').pop()
            let user = VerifyToken(token)
            req.user = user
            next();
        }
        else {
            res.send({
                status: false,
                data: 'Unauthorizied User'
            })
        }
    } catch (error) {
        res.send({
            status: false,
            data: error
        })
    }
}


async function VerifyAdmin(req, res, next) {
    console.log(req.user) 
    if (!req?.user?.data?.isAdmin) {
        res.send({
            status: false,
            message: 'You are not Authorized'
        })
        return

    }
    next()
}

module.exports = {VerifyUser, VerifyAdmin}

