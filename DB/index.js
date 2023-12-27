const { connect } = require('mongoose')
const config = require('../Config')
const Database = config.DATA_BASE
async function ConnectDatabase() {
    try {
        await connect(Database)
        console.log("Database Connected")
    } catch (error) {
        console.log("Error in Backend", error)
    }
}

module.exports = ConnectDatabase