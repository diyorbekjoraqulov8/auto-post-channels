const bot = require('../bot')
const { User } = require('../../model')
const {getAllChannels} = require("../features/user/channelCrud");
const {getAllUsers} = require("../features/common/user");

bot.on('callback_query', async (ctx) => {
    const query = ctx.update.callback_query
    const { data } = query
    const chatId = query.from.id
    const user = await User.findOne({chatId}).lean()
    const queryAction = data.split('-')
    if(user?.status === 1) {
        if (user?.active) {
            if (queryAction[0] === 'channel') {
                if (queryAction[1] === 'my') {
                    const channels = await getAllChannels()

                    let replyMessage = "Sizning kanallaringiz!\n\n"

                    for (let i = 0; i < channels.length; i++) {
                        replyMessage += `${i+1}) ${channels[i].channelName}: @${channels[i].channelUserName}\n`
                    }
                    ctx.reply(replyMessage)
                } else if (queryAction[1] === 'add') {
                    const channelLink = `https://t.me/${ctx.botInfo?.username}?startchannel`
                    const groupLink = `https://t.me/${ctx.botInfo?.username}?startgroup`
                    let replyMessage = `Bu linklarni kanal egasiga tashlaysiz!\n\nKanal qo'shish uchun!\n${channelLink}\n\nGuruhga qo'shilish uchun\n${groupLink}`
                    ctx.reply(replyMessage)
                }
            }
        } else {
            const devs = await getAllUsers({ role: 'DEV' })
            let replyMessage = "🤖 Botdan to'liq foydalanish uchun ADMIN tomonidan tasdiqlanishingiz kerak!\n\n👮 Adminlar\n\n"
            for (let i = 0; i < devs?.length; i++) {
                replyMessage += `${i+1}) ${devs[i]?.full_name}\nTEL: +998${devs[i]?.phone}`
            }
            ctx.reply(replyMessage)
        }
    }
})