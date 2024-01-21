const { Router } = require('express')
const axios = require('axios');
const PaymentRouter = Router()

PaymentRouter.post('/api/proxy', async (req, res) => {
    try {
        const response = await axios.post('https://allapi.in/order/create', req.body);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = PaymentRouter;