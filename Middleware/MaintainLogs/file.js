const fs = require('fs');

// Define the path to the log file globally
const LOG_FILE_PATH = __dirname + '/log.json';

/**
 * Function to write log data to a file.
 * @param {object} data - The log data to be written to the file.
 */
const writefile = async (data) => {
    // Read existing log file or create an empty array if file doesn't exist
    let logData = [];
    try {
        const logFile = fs.readFileSync(LOG_FILE_PATH, 'utf8');
        logData = JSON.parse(logFile);

    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error('Error reading log file:', err);
        }
    }

    // Append the request data to the logData array
    logData.push(data);

    // Write the updated logData array back to the log file
    fs.writeFile(LOG_FILE_PATH, JSON.stringify(logData, null, 2), err => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
        console.log('Log file updated!');
    });
};

/**
 * Function to reset the log file by overwriting it with an empty array.
 */
const ResetFile = () => {
    fs.writeFile(LOG_FILE_PATH, '[]', err => {
        if (err) {
            console.error('Error in resetting log file:', err);
        }
        console.log('Log file resetted');
    });
};

module.exports = {
    writefile,
    ResetFile,
    LOG_FILE_PATH // Export the log file path for global access if needed
};
