let config = {
    DATA_BASE: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    PAYMENT_TOKEN: process.env.PAYMENT_TOKEN
}
module.exports = config;