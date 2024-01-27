const Course = require("../Model/Course.Model");
const Payment = require("../Model/Payment.Model");
const Question = require("../Model/Question.Model");
const Report = require("../Model/Report.Model");
const User = require("../Model/User.Model");
const Withdraw = require("../Model/Withdraw.Model");


async function AllData() {
    try {
        const options = { page:1, limit:10 };
        const userData = await User.paginate({}, options);
        const courseData = await Course.paginate({}, options);
        const questionData = await Question.paginate({}, options);
        const reportData = await Report.paginate({}, options);
        const withdrawData = await Withdraw.paginate({}, options);
        const paymentData = await Payment.paginate({}, options);

        return {
            status: true,
            data: {
                UserData: userData,
                CourseData: courseData,
                QuestionData: questionData,
                ReportData: reportData,
                WithdrawData: withdrawData,
                PaymentData: paymentData,
            },
        };
    } catch (error) {
        console.log(error)
        return {
            status: false,
            message: "Internal Server Error",
            error: error,
        };
    }
}

module.exports = {AllData};
