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
const app = express();


app.use(express.json());
// app.use(express.static('static'));
app.use(cors());
app.use(morgan('tiny'))


app.use("/user", UserRouter)
app.use('/course', CourseRouter)
app.use('/q&a', QuestionRouter)
app.use('/report', ReportRouter)
app.get("/", (req, res) => {
    res.send("all is well")
})

ConnectDatabase()
    .then(() => {
        app.listen(8000)
        console.log("Server Started")
    }).catch((error) => console.log("Error==>", error))



/*
{
    "status": true,
        "data": {
        "name": "Ritik",
            "phone": "9988776655",
                "wallet": 0,
                    "_id": "6551c0e4739b385290b03a0c",
                        "createdAt": "2023-11-13T06:23:32.140Z",
                            "updatedAt": "2023-11-13T06:23:32.140Z",
                                "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTUxYzBlNDczOWIzODUyOTBiMDNhMGMiLCJuYW1lIjoiUml0aWsiLCJwaG9uZSI6Ijk5ODg3NzY2NTUiLCJpYXQiOjE2OTk4NTY2MTJ9.njfUYtvxUwdrNObit4kSlt2W7dGTfXiZMUHwHIYKTVs"
}

{
  "status": true,
  "data": {
    "name": "Raj",
    "phone": "1122334455",
    "wallet": 0,
    "_id": "6551c14069395387c17021bf",
    "createdAt": "2023-11-13T06:25:04.083Z",
    "updatedAt": "2023-11-13T06:25:04.083Z",
    "__v": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTUxYzE0MDY5Mzk1Mzg3YzE3MDIxYmYiLCJuYW1lIjoiUmFqIiwicGhvbmUiOiIxMTIyMzM0NDU1IiwiaWF0IjoxNjk5ODU2NzA0fQ.8iq5Rk6tgl43w74BjAe4ZJxrAMl_ZkJ2yKqVYbrDWTU"
}

{
  "status": true,
  "data": {
    "name": "Raj Ritk",
    "phone": "1122334455",
    "wallet": 0,
    "_id": "6551c168f4f77fca5a9226b6",
    "createdAt": "2023-11-13T06:25:44.227Z",
    "updatedAt": "2023-11-13T06:25:44.227Z",
    "__v": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTUxYzE2OGY0Zjc3ZmNhNWE5MjI2YjYiLCJuYW1lIjoiUmFqIFJpdGsiLCJwaG9uZSI6IjExMjIzMzQ0NTUiLCJpYXQiOjE2OTk4NTY3NDR9.h6jqbaHU9hQbU7ue5x5ettjWqVIBkgZpHDp_3AE2YcE"
}



{
  "status": true,
  "data": {
    "question": "question 1",
    "phone": "1122334455",
    "answer": "",
    "liked": [],
    "_id": "6551c1ca3334dfae4ca37572",
    "createdAt": "2023-11-13T06:27:23.009Z",
    "updatedAt": "2023-11-13T06:27:23.009Z",
    "__v": 0
  }
}


*/