const nodemailer = require('nodemailer');
const { ResetFile } = require('./file');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'munnamichal820@gmail.com',
        pass:'gpdv kflt jwcv zcaf'
    }
});



const SendDailyLog = async () => {

    try {
        await transporter.sendMail({
            from: {
                address: 'munnamichal820@gmail.com',
                name: 'Futureiqra',

            },

            to: 'ritikra3rrr@gmail.com',
            subject: "Daily Logs from futureiqra",
            text: "Log file",
            attachments: [{
                filename: 'log.json',
                path: './log.json' // Attach the content of log.json
            }]
        });
        console.log('Email sent successfully');
        ResetFile()
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
SendDailyLog()


module.exports = SendDailyLog;
