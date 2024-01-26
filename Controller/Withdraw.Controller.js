const User = require("../Model/User.Model")
const Withdraw = require("../Model/Withdraw.Model")


async function CreateWithdrwalRequest({ userId, upi_Id, email, amount }) {
    try {
        let user = await User.findById(userId)
        if (!user) {
            return {
                status: false,
                message: 'No User Found!'
            }
        } 
        if (user.wallet < amount) {
            return {
                status: false,
                message: 'Width amount is greater than amount in wallet'
            }
        }
        user.wallet = user.wallet - amount;
        await user.save()
        let request = await Withdraw.create({ userId, upi_Id, email, amount, status: 'Pending' })
        return {
            status: true,
            message: 'Request Create',
            data: request
        }
    } catch (error) {
        return {
            status: false,
            message: 'Internal Server Error',
            error: error
        }
    }
}

async function ChangeWithdrawStatus({ _id, status }) {
    try {
        let withdraw = await Withdraw.findById(_id)
        if (!withdraw) {
            return {
                status: false,
                message: 'No data fonund!'
            }
        }
        withdraw.status = status;
        await withdraw.save();
        return {
            status: true,
            message: 'Status Change Succuessfully',
            data: withdraw
        }
     } catch (error) {
        return {
            status: false,
            message: 'Internal Server Error',
            error: error
        }
    }
    
}




async function GetWithdrawData(filter = {}, search = "", days = 0, perPage = 10, page = 1) {
    try {
        // Define the base query
        const query = {
            ...filter,
            $or: [
                { userId: { $regex: new RegExp(search, 'i') } },
                { upi_Id: { $regex: new RegExp(search, 'i') } },
                // Add more fields you want to search here
            ],
        };

        // Apply date filters if specified
        if (days > 0) {
            const dateFilter = new Date();
            dateFilter.setDate(dateFilter.getDate() - days);
            query.createdAt = { $gte: dateFilter };
        }

        // Fetch the total count of records
        const totalCount = await Withdraw.countDocuments(query);

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / perPage);

        // Fetch data from the database with pagination
        const withdrawData = await Withdraw.find(query)
            .limit(perPage)
            .skip(perPage * (page - 1));

        return {
            status: true,
            data: withdrawData,
            totalPage: totalPages,
        };
    } catch (error) {
        console.error('Error fetching withdraw data:', error);
        throw error;
    }
}
module.exports = {
    CreateWithdrwalRequest,
    ChangeWithdrawStatus,
    GetWithdrawData
}