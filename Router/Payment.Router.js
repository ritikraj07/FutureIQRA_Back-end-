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
            callback_url: `https://www.futureiqra.in/thank-you/${orderId}`,
        };
        // console.log('\n\n\n', courseData)
        const response = await axios.post('https://allapi.in/order/create', courseData);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// https://www.futureiqra.in/thank-you/${orderId}
// /callback/futureiqra /
//     https://futureiqra.onrender.com/payment/callback/futureiqra/:orderId


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

// let paymentStatus = false
// let count = 0

// PaymentRouter.post('/callback', async (req, res) => {
//     const { status, message, order_id } = req.body
//     console.log(status, req.body, '============================<=====================>', req)
//     count++;
//     console.log(count)
//     if (status) {
//         paymentStatus = true

//     } else {
//         paymentStatus = false
//     }
//     res.json({status: paymentStatus})
// })




// PaymentRouter.get('/status', async (req, res) => {
//     res.json({status: paymentStatus})
// })


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

