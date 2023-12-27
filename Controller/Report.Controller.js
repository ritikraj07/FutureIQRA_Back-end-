const Report = require("../Model/Report.Model")

async function PostReport({ name, report, email, subject, phone }) {
    try {
        const data = await Report.create({ name, report, email, subject, phone })
        return {
            status: true,
            data: data
        }
     } catch (error) {
        return {
            status: false,
            data: error
        }
    }
    

}

async function GetAllReport() {
    try {
        const reports = await Report.find()
        return {
            status: true,
            data: reports
        }
    } catch (error) {
        return {
            status: false,
            data: error
        }
    }
}

async function DeleteReports({deleting_ids}) {
    try { 
        await Report.deleteMany({ _id: { $in:  deleting_ids } })
        return {
            status: true,
            data: 'Selected Reports Deleted'
        }
    } catch (error) {
        return {
            status: false,
            data: 'Something went wrong'
        }
    }
}



module.exports = {PostReport, GetAllReport, DeleteReports}