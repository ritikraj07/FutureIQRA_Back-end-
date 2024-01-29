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
                let refer_prize = 0
                if (payment.product == 'VIP1') {
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
        const batchSize = 100; // Adjust as needed
        let currentTime = new Date().toISOString();
        // console.log('current time from updateExpiredPayments', currentTime);

        // Fetch payments in batches
        let offset = 0;
        let hasMorePayments = true;

        while (hasMorePayments) {
            const expiredPayments = await Payment.aggregate([
                {
                    $match: {
                        status: 'Success',
                        expireTime: { $lte: currentTime},
                    },
                },
                {
                    $project: {
                        _id: 0,
                        orderId: 1,
                        phone: 1
                    },
                },
                { $skip: offset },
                { $limit: batchSize },
            ]);
            // console.log(expiredPayments)

            // Extract phone numbers from the result
            const phonesToUpdate = expiredPayments.map((payment) => payment.phone);
            const orderIdToUpdate = expiredPayments.map((payment)=>payment.orderId)
            // Update the status of expired payments to 'Expire'
            await Payment.updateMany(
                {
                    orderId: { $in: orderIdToUpdate },
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

            offset += batchSize;
            hasMorePayments = expiredPayments.length === batchSize;
        }
    } catch (error) {
        console.error('Error updating expired payments and user types:', error);
    }
}

setInterval(updateExpiredPayments, 1000*60*60);











module.exports = {
    GetPaymentStatus, CreatePaymentRequest,
    ChangePaymentStatus, GetAll_User_Payment_Data
}