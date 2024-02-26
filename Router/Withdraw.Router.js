const {Router} = require('express')
const { VerifyAdmin, VerifyUser } = require('../Middleware/Auth.Middleware');
const { CreateWithdrwalRequest, ChangeWithdrawStatus, GetWithdrawData } = require('../Controller/Withdraw.Controller');


const WithdrawRouter = Router()


/**************************************** POST ******************************************/


// withdrawal request
WithdrawRouter.post('/', VerifyUser,async (req, res) => {
    let userId = req.user.data._id
    let { upi_Id, amount, email } = req.body;
    let response = await CreateWithdrwalRequest({userId, upi_Id, email,amount})
    res.send(response)
})



/**************************************** PATCH ******************************************/

WithdrawRouter.patch('/', VerifyUser, VerifyAdmin, async (req, res) => {
    let { _id, status } = req.body
    
    let response = await ChangeWithdrawStatus({ _id, status })
    res.send(response)
})


/**************************************** GET ******************************************/


WithdrawRouter.get('/', async (req, res) => {
    try {
        const { status, search, days, perPage, page } = req.query;

        // Convert string query parameters to appropriate types
        const parsedDays = parseInt(days) || 0;
        const parsedPerPage = parseInt(perPage) || 10;
        const parsedPage = parseInt(page) || 1;

        // Convert status query parameter to an array of strings

        const withdrawData = await GetWithdrawData(
            status || "",
            search || "",
            parsedDays,
            parsedPerPage,
            parsedPage
        );

        res.json(withdrawData);
    } catch (error) {
        console.error('Error fetching withdraw data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

/**************************************** DELETE ******************************************/



module.exports = WithdrawRouter;
