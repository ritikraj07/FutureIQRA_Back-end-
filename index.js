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
const app = express();


app.use(express.json());
// app.use(express.static('static'));
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://www.futureiqra.in');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


app.use(morgan('tiny'))


app.use("/user", UserRouter)
app.use('/course', CourseRouter)
app.use('/q&a', QuestionRouter)
app.use('/report', ReportRouter)
app.use('/payment', PaymentRouter)
app.get("/", (req, res) => {
    res.send("all is well")
})

ConnectDatabase()
    .then(() => {
        app.listen(8000)
        console.log("Server Started")
    }).catch((error) => console.log("Error==>", error))

