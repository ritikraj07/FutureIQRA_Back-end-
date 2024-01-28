const Payment  = require("../Model/Payment.Model");
const User = require("../Model/User.Model");


async function CreatePaymentRequest(paymentData) {
    try { 
        const existingPayment = await Payment.findOne({ orderId: paymentData.orderId });

        if (existingPayment) {
            // Payment with the orderId already exists
            return {
                status: false,
                message: 'Payment with the given orderId already exists.',
            };
        }
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


async function updateExpiredPayments() {
    try {

        let currentTime = new Date();

        console.log('current time from updateExpiredpayments', currentTime)
        

        // Use the aggregation pipeline to find payments with status 'Success' and expireTime less than or equal to the current time
        const expiredPayments = await Payment.aggregate([
            {
                $match: {
                    status: 'Success',
                    expireTime: { $lte: currentTime },  // Compare directly with currentTime
                },
            },
            {
                $project: {
                    _id: 0,
                    phone: 1,
                },
            },
        ]).option({ maxTimeMS: 60000 });

        // Extract phone numbers from the result
        const phonesToUpdate = expiredPayments.map((payment) => payment.phone);

        // Update the status of expired payments to 'Expire'
        await Payment.updateMany(
            {
                phone: { $in: phonesToUpdate },
                status: { $ne: 'Expire' },
            },
            { $set: { status: 'Expire' } }
        );

        console.log('Expired payments updated successfully.');

        // Find users by phone and update userType to 'Basic'
        await User.updateMany(
            { phone: { $in: phonesToUpdate } },
            { $set: { userType: 'Basic' } }
        );

        console.log('User types updated successfully.');
    } catch (error) {
        console.error('Error updating expired payments and user types:', error);
    }
}


setInterval(updateExpiredPayments,1000*60*60)





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