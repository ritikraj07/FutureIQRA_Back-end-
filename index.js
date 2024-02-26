require('dotenv').config()
const express = require('express');
const cors = require('cors');
const morgan = require('morgan')

const UserRouter = require('./Router/User.Router');
// var session = require('express-session');
const ConnectDatabase = require('./DB');
const QuestionRouter = require('./Router/Question.Router');
const ReportRouter = require('./Router/Report.Router');
const CourseRouter = require('./Router/Course.Router');
const PaymentRouter = require('./Router/Payment.Router');
const WithdrawRouter = require('./Router/Withdraw.Router');
const AdminRoute = require('./Router/Admin.Router');
const app = express();


app.use(cors());
app.use(express.json());
// app.use(express.static('static'));

// app.use((req, res, next) => {
//     // how to use this url also https://futureiqra.onrender.com/ this my backend url
//   res.header('Access-Control-Allow-Origin', 'https://www.futureiqra.in');  // frontend url
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); 
  
//   next();
// });

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'https://www.futureiqra.in');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });


app.use(morgan('tiny'))


app.use("/user", UserRouter)
app.use('/course', CourseRouter)
app.use('/q&a', QuestionRouter)
app.use('/report', ReportRouter)
app.use('/payment', PaymentRouter)
app.use('/withdraw', WithdrawRouter)
app.use('/admin', AdminRoute)

app.get("/", (req, res) => {
    res.send("all is well")
})

ConnectDatabase()
    .then(() => {
        app.listen(8000)
        console.log("Server Started")
    }).catch((error) => console.log("Error==>", error))

