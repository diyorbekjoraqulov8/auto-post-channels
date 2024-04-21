const bot = require('../bot')
const {findUser, deleteUser, updateUser, getAllUsers} = require("../features/common/user");
const {authUser} = require("../auth");
const {welcome} = require("../common/messages/welcome-message");
const {home_keyboards} = require("../common/buttons/inlineKeyboards");
const postChannels = require('../features/user/postChannels')
const {deleteChannelDb, saveChannelDb, getChannel} = require("../features/user/channelCrud");

bot.start(async (ctx) => {
    if (ctx.chat.type === 'private') {
        const chatId = ctx.chat.id
        let user = await findUser({chatId})
        if (!user?.status) {
            if (user?._id) {
                // Delete User
                await deleteUser(user.id)
                user = null
            }
            // User Auth
            return await authUser(user, ctx)
        } else {
            await welcome(ctx, home_keyboards, user)
        }
    }
});

bot.on('my_chat_member', async (ctx) => {
    try {
        const admins = await getAllUsers({ role: 'ADMIN' })
        let adminNotificationMessage = ''
        const new_member = ctx.update.my_chat_member?.new_chat_member
        const chat = ctx.update.my_chat_member?.chat
        if (new_member?.status === "administrator") {
            const channel = await getChannel({ channelId: chat?.id })
            if (channel?._id) {
                adminNotificationMessage = `🔐 Ruxsatlar yangilandi:\n\nKanal: ${chat.title}\n@${chat?.username}`
            } else {
                await saveChannelDb({
                    channelName: chat?.title,
                    channelId: chat?.id,
                    channelUserName: chat?.username,
                    status: chat?.type
                })
                adminNotificationMessage = `👮 Admin qilindi:\n\nKanal: ${chat?.title}\n@${chat?.username}`
            }
            for (let i = 0; i < admins.length; i++) {
                await ctx.telegram.sendMessage(admins[i].chatId, adminNotificationMessage)
            }
        } else if (new_member?.status === "kicked") {
            await deleteChannelDb({ channelId: chat?.id })
            adminNotificationMessage = `❌ Chopildi:\n\nKanal: ${chat?.title}\n@${chat?.username}`
            for (let i = 0; i < admins.length; i++) {
                await ctx.telegram.sendMessage(admins[i].chatId, adminNotificationMessage)
            }
        }
    } catch (error) {
        console.error('Error handling new chat members event:', error);
    }
});
bot.on('text', async (ctx) => {
    if (ctx.chat.type === 'private') {
        await messageWorker('text', ctx)
    }
});
bot.on('photo', async (ctx) => {
    if (ctx.chat.type === 'private') {
        await messageWorker('photo', ctx)
    }
});
bot.on('video', async (ctx) => {
    if (ctx.chat.type === 'private') {
        await messageWorker('video', ctx)
    }
});
bot.on('document', async (ctx) => {
    if (ctx.chat.type === 'private') {
        await messageWorker('document', ctx)
    }
});

async function messageWorker(type, ctx) {
    const chatId = ctx.chat.id
    const text = ctx.message.text?.toLocaleLowerCase().trim()
    const user = await findUser({chatId})

    if (!user?.status) {
        // User Auth
        await authUser(user, ctx)
    } else {
        if(user?.active) {
            if(text === '/post' || text === 'post') {
                await updateUser(user?._id, {
                    ...user._doc,
                    action: 'post-channels'
                })
                ctx.reply("Postni jo'nating")
            } else if(user?.action === 'post-channels') {
                await postChannels(user, type, ctx)
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
}

const commands = [
    { command: 'start', description: "Ishni boshlash" },
    { command: 'post', description: "Post joylash" }
];
bot.telegram.setMyCommands(commands)
    .then(() => {
        console.log('Commands set successfully');
    }).catch((error) => {
    console.error('Error setting commands:', error);
});