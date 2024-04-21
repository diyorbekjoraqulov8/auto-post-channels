const {Markup} = require("telegraf");
const home_keyboards = Markup.inlineKeyboard([
    [
        {
            text:"Kanal qo'shish",
            callback_data: 'channel-add'
        },
        {
            text:"Mening kanallarim",
            callback_data: 'channel-my'
        },
    ]
])

module.exports = {
    home_keyboards
}