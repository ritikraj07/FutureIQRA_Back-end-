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
// const SearchLogger = require('./Middleware/MaintainLogs');
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(SearchLogger)
// app.use(express.static('static'));

// Middleware to validate requests from specific domains
app.use((req, res, next) => {
    const allowedDomains = ['https://www.futureiqra.in', 'https://futureiqra.onrender.com','https://allapi.in' ]; // List of allowed domains

    const origin = req.headers.origin; // Get the origin from the request headers
        console.log(origin, "origin")
    // Check if the origin is in the list of allowed domains
    if (allowedDomains.includes(origin)) {
        // Set the Access-Control-Allow-Origin header to allow requests from the origin
        res.setHeader('Access-Control-Allow-Origin', origin);
        // Set other CORS headers as needed
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        // Continue processing the request
        next();
    } else {
        // Return an error response if the origin is not allowed
        return res.status(403).json({ error: 'Forbidden: Origin not allowed' });
    }
});


// app.use((req, res, next) => {
//     console.log(req)
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

app.get('/avatars', (req, res) => { 
    res.sendFile(__dirname + '/avatars.png')
})

app.get("/", (req, res) => {
    res.send("all is well")
})

ConnectDatabase()
    .then(() => {
        app.listen(8000)
        console.log("Server Started")
    }).catch((error) => console.log("Error==>", error))

