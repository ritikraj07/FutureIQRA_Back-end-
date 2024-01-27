const { Payment } = require("../Model/Payment.Model");
const User = require("../Model/User.Model");


async function CreatePaymentRequest(paymentData) {
    try { 

        let payment = await Payment.create(paymentData)
        if (paymentData.status == 'Success') {
            let user = await User.findOne({ phone: paymentData.phone })
            if (user) {
                user.userType = paymentData.product
                await user.save()
            }
            let referedByUser = await User.findOne({ referCode: user.referby })
            if (referedByUser) {
                let refer_prize = 0
                if (paymentData.product == 'VIP1') {
                    refer_prize = 370
                } else {
                    refer_prize = 540
                }
                
                referedByUser.wallet = referedByUser.wallet + refer_prize
                await referedByUser.save();
            }


        }
        
        return {
            status: true,
            data: payment
        }
        
    } catch (error) {
        return {
            status: false,
            message: 'Internal Server Error',
            error: error
        }
    }
}
// referby
async function GetPaymentStatus({orderId}) {
    try {
        let payment = await Payment.findOne({ orderId: orderId })
        
        if (!payment) {
            return {
                status: false,
                message: 'Invalid OrderID!',
            }
        }
        return {
            status: true,
            data: payment
        }
    } catch (error) {
        return {
            status: false,
            message: 'Internal Server Error',
            error: error
        }
    }
}



async function ChangePaymentStatus(id, status) {
    try { 
        let payment = await Payment.findOne({orderId: id})
        payment.status = status
        await payment.save()
        if (status == 'Success') {
            let user = await User.findById(payment.userId)
            let referedByUser = await User.findOne({ referCode: user.referby })
            if (referedByUser) {
                let refer_prize = getRandomNumber(1, data.amount)
                referedByUser.wallet = referedByUser.wallet + refer_prize
                await referedByUser.save();
            }

        }
        return {
            status: true,
            data: payment
        }
    } catch (error) {
        return {
            status: false,
            message: 'Internal Server Error',
            error: error
        }
    }
}

async function GetAll_User_Payment_Data(phone) {
    try {
        let payment = await Payment.findOne({ phone: phone})
        return {
            status: true,
            data: payment, 
            message: 'Success'
        }
    } catch (error) {
        return {
            status: false,
            message: 'Internal Server Error',
            error: error
        }
    }
}





function getRandomNumber(min, max) {
    if (min > max) {
        [min, max] = [max, min];
    }
    const randomNumber = Math.random() * (max - min) + min;
    return Math.floor(randomNumber);
}


module.exports = {
    GetPaymentStatus, CreatePaymentRequest,
    ChangePaymentStatus, GetAll_User_Payment_Data
}