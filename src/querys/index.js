const bot = require('../bot')
const { User } = require('../../model')

bot.on('callback_query', async query => {
    const { data } = query
    const chatId = query.from.id
    const user = await User.findOne({chatId}).lean()
    const queryAction = data.split('-')
    if(user.status === 1) {
        if (queryAction[0] === 'channel') {
            if (queryAction[1] === 'my') {

            } else if (queryAction[1] === 'add') {

            }
        }
    }
})