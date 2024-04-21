require('dotenv').config();
const mongoose = require('mongoose');

const app = require('./src/utils/server')

const ENVIRONMENTS = ['TEST', 'PROD']

// When PRODUCTION / TEST work
if (ENVIRONMENTS.includes(process.env.ENVIRONMENT)) {
    console.log('TEST mode work')
    const task = require('./src/utils/cron/cron')
    task.start()
}

async function run() {
    try {
        await mongoose.connect(process.env.APP_MONGODB_URI)
        app.listen(process.env.PORT, ()=> {
            console.log(`Server is running: ${process.env.PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}
run()