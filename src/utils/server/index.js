const express = require('express')
const bot = require('../../bot')

const app = express();
app.use(express.json())

if (process.env.ENVIRONMENT === 'DEV') {
    bot.launch().then()
} else {
    app.use(bot.webhookCallback('/telegram'))
}

module.exports = app