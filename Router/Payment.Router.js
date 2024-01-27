const { Router } = require('express')
const axios = require('axios');
const config = require('../Config');
const { VerifyUser } = require('../Middleware/Auth.Middleware');
const { CreatePaymentRequest, GetPaymentStatus, ChangePaymentStatus, GetAll_User_Payment_Data } = require('../Controller/Payment.Controller');
const PaymentRouter = Router()

PaymentRouter.post('/api/proxy', VerifyUser, async (req, res) => {
    try {
        let { amount, note, product_name, email, name, phone } = req.body
        let token = config.PAYMENT_TOKEN
        
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
            callback_url: `https://futureiqra.onrender.com/payment/status/${orderId}`,
        };
        

        const response = await axios.post('https://allapi.in/order/create', courseData);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error route' });
    }
});

PaymentRouter.post('/status/:orderId', async (req, res) => {
    
        let { orderId } = req.params;
        res.redirect(`https://www.futureiqra.in/thank-you/${orderId}`);
 
});




PaymentRouter.get('/order-status/:orderId', async (req, res) => {
    try {
        
        let orderId = req.params.orderId
        let response = await GetPaymentStatus(orderId)
        if (response.data.status == 'Pending') {
            let data = {
                token: config.PAYMENT_TOKEN,
                order_id: orderId,
            };
            const response = await axios.post("https://allapi.in/order/status", data)
            if (response.data.results.status !== 'Pending') {
                let newResponse = await ChangePaymentStatus(orderId, response.data.results.status)
                res.send(newResponse)
            }
        } else if (response.status == false && response.message == 'Invalid OrderID!') {

            let data = {
                token: config.PAYMENT_TOKEN,
                order_id: orderId,
            };

            const response = await axios.post("https://allapi.in/order/status", data);
            

            if (response.data.status) {
                let paymentData = {
                    phone: response.data.results.customer_mobile,
                    orderId: orderId,
                    transactionData: response.data.results.txn_date,
                    amount: response.data.results.txn_amount,
                    product: response.data.results.product_name,
                    paymentMode: response.data.results.payment_mode,
                    status: response.data.results.status,
                    expireTime: ExpireTime(response.data.results.txn_date),

                };
                let paymentResponse = await CreatePaymentRequest(paymentData);
                res.send(paymentResponse)
            }
        }
        
        else {
            res.send(response)
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



PaymentRouter.get('/all/:phone',VerifyUser, async (req, res) => {
    try { 
        let phone = req.params.phone
        let response = await GetAll_User_Payment_Data(phone)
        res.send(response)
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

function ExpireTime(inputDate) {
    const date = new Date(inputDate);

    // Get the next month
    date.setMonth(date.getMonth() + 1);

    // Extract date, month, and year
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    // Combine the values into a formatted string
    const formattedDate = `${day} ${month} ${year}`;

    return formattedDate;
}


