const { Router } = require('express')
const axios = require('axios');
const config = require('../Config');
const { VerifyUser } = require('../Middleware/Auth.Middleware');
const PaymentRouter = Router()

PaymentRouter.post('/api/proxy', VerifyUser, async (req, res) => {
    try {
        let { _id } = req.user
        let { amount, note, product_name, email, name, phone } = req.body
        let token = config.PAYMENT_TOKEN
        // console.log(req.body, "token", token, _id)
        let orderId = GenerateOrderId()

        let courseData = {
            token: token,
            order_id: orderId,
            txn_amount: amount,
            txn_note: note,
            product_name: product_name,
            customer_name: name,
            customer_mobile: phone,
            customer_email: email,
            callback_url: `https://futureiqra.onrender.com/payment/futureiqra/${orderId}`,
        };
        // console.log('\n\n\n', courseData)
        const response = await axios.post('https://allapi.in/order/create', courseData);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

PaymentRouter.post('/futureiqra/:orderId', (req, res) => {
    let orderId = req.params.orderId
    res.redirect(`https://www.futureiqra.in/thank-you/${orderId}`)
})






PaymentRouter.post('/order/status/:orderId', async (req, res) => {
    try {

        let orderId = req.params.orderId
        let data = {
            token: config.PAYMENT_TOKEN,
            order_id: orderId,
        };
        const response = await axios.post("https://allapi.in/order/status", data)
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


module.exports = PaymentRouter;




function GenerateOrderId() {
    // Prefix
    const prefix = "ORDS";

    // Current date in YYMMDD format
    const currentDate = new Date().toLocaleDateString("en-US", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
    });

    // Remove the slashes from the date
    const formattedDate = currentDate.replace(/\//g, "");

    // Generate a random 3-digit number
    const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, "0");

    // Concatenate the parts to create the final text
    const generatedText = `${prefix}${formattedDate}${randomNumber}`;

    return generatedText;
}

