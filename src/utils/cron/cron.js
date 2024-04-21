const cron = require('node-cron')
const axios = require('axios')

const task = cron.schedule("*/10 * * * *", async () => {
    try {
        const response = await axios.post(process.env.WEBHOOK_URI);
        console.log(`Cron job executed at: ${new Date().toLocaleString()};\n Response: ${response[0]}`);
    } catch (error) {
        console.log("ERROR: ", error)
    }
})

module.exports = task