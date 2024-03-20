const { writefile } = require("./file");
const SendDailyLog = require("./mail");

/**
 * Middleware function to log search requests to a file and schedule sending daily logs at 12:00:00 AM.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function in the chain.
 */
const SearchLogger = async (req, res, next) => {
    const data = {
        timestamp: new Date().toISOString(),
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        method: req.method,
        url: req.url,
        queryParams: req.query,
        userAgent: req.headers['user-agent'],
        referrer: req.headers.referer || req.headers.referrer
    };

    await writefile(data);

    // Calculate the delay until the next midnight
    // const now = new Date();
    // const midnight = new Date(
    //     now.getFullYear(),
    //     now.getMonth(),
    //     now.getDate() + 1, // Next day
    //     0, // Hour
    //     0, // Minute
    //     0 // Second
    // );
    // const delay = midnight.getTime() - now.getTime();

    // // Schedule sending daily logs at midnight
    // setTimeout(SendDailyLog, delay);

    // next();
};

module.exports = SearchLogger;
