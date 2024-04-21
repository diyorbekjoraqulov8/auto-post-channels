const {Markup} = require("telegraf");
const {createUser, updateUser} = require("./features/common/user");
const {home_keyboards} = require("./common/buttons/inlineKeyboards");

async function authUser(user, ctx) {
    const chatId = ctx.chat.id
    const text = ctx.message.text?.toLocaleLowerCase()?.trim()
    if (!user) {
        await createUser(chatId, 'auth-client-name')
        ctx.reply("Ismingizni kiriting!\nMisol: Diyorbek Jo'raqulov ", Markup.removeKeyboard())
    } else if(!user.full_name) {
        await updateUser(user?._id, {
            ...user._doc,
            full_name: ctx.message.text?.trim(),
            action: 'auth-client-phone'
        })
        ctx.reply("Raqamingizni kiriting!\nMisol: 83802922", Markup.removeKeyboard())
    } else if(!user.phone) {
        let res = checkPhone(+text)
        if (res === true) {
            const welcomeText = "Assalomu Alaykum. Elon ulashish botiga xush kelibsiz!\n\n⬇️ ⬇️ Pastdagi munyulardan keraklisini tanlang"
            await updateUser(user?._id, {
                ...user._doc,
                phone: text.trim(),
                status: 1,
                action: 'menu'
            })

            // Notify admin

            ctx.reply(welcomeText, home_keyboards)
        } else {
            ctx.reply(res)
        }
    }
}

module.exports = {
    authUser
}
const allowedCodes = ['33','50','55','77','88','90','91','93','94','95','97','98','99'];
function checkPhone(phoneNumber) {
    // argument type must be NUMBER
    if (!phoneNumber || typeof phoneNumber !== 'number') {
        return "Telefon raqamga faqat son kiritmang!"
    }
    if (9 !== String(phoneNumber)?.length) {
        return "9 ta son kiriting!"
    }
    let num = String(phoneNumber)?.slice(0,2)
    if (allowedCodes.includes(num)) {
        return true
    } else {
        return "O'zbekiston raqamini kiriting"
    }
}