const {updateUser} = require("../../features/common/user");

const welcomeText = "Assalomu Alaykum!.\n\n⬇️ ⬇️ Pastdagi munyulardan keraklisini tanlang"

const welcome = async (ctx, buttons, user) => {
    await updateUser(user?._id, {
        ...user._doc,
        action: 'menu',
        status:1
    })
    ctx.reply(welcomeText, buttons)
}

module.exports = {
    welcome
}