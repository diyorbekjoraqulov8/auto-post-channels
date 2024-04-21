const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.APP_BOT_TOKEN)

module.exports = bot

require('./messages')
require('./querys')