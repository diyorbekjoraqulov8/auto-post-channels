const {updateUser} = require("../common/user");
const {getAllChannels} = require("./channelCrud");

async function postGenerator(channelId, type, ctx) {
    if (type === 'text') {
        const text = ctx.message.text?.toLocaleLowerCase().trim()
        const reply_markup = ctx.message?.reply_markup

        await ctx.telegram.sendMessage(channelId, text, {
            reply_markup
        });
    } else if (type === 'photo') {
        const imageFileId = ctx.message.photo[0]?.file_id
        const caption = ctx.message.caption
        const reply_markup = ctx.message.reply_markup

        await ctx.telegram.sendPhoto(channelId, imageFileId, {
            caption,
            reply_markup
        });
    } else if (type === 'video') {
        const videoFileId = ctx.message.video.file_id
        const caption = ctx.message.caption
        const reply_markup = ctx.message.reply_markup

        await ctx.telegram.sendVideo(channelId, videoFileId, {
            caption,
            reply_markup
        });
    } else if (type === 'document') {
        const docFileId = ctx.message.document.file_id
        const caption = ctx.message.caption
        const reply_markup = ctx.message.reply_markup
        await ctx.telegram.sendDocument(channelId, docFileId, {
            caption,
            reply_markup
        });
    }
}

async function sendPostChannels(user, type, ctx) {
    try {
        const botId = ctx.botInfo.id

        const channels = await getAllChannels()
        if (channels?.length) {
            let success = `✅ Post joylandi\n\n`
            let failed = `\n❌ Post joylanmadi\n\n`
            for (let i = 0; i < channels.length; i++) {
                const getChatMember= await ctx.telegram.getChatMember(channels[i].channelId, botId);

                if(channels[i].status === 'supergroup' || getChatMember?.can_post_messages) {
                    success += `${i+1}) ${channels[i].channelName} @${channels[i].channelUserName}\n`

                    await postGenerator(channels[i].channelId, type, ctx)
                } else {
                    failed += `${i+1})${channels[i].channelName}\n`
                }
            }
            return `Natija:\n\n${success}${failed}`
        } else {
            ctx.reply("Bot hech qanday kanalga admin bo'lmagan")
        }

        await updateUser(user?._id, {
            action: 'menu'
        })
    } catch (error) {
        throw Error(error.message)
    }
}

async function postChannels(user, type, ctx) {
    await updateUser(user?._id, {
        action: 'process_post'
    })

    const response = await sendPostChannels(user, type, ctx)

    ctx.reply(response)
}

module.exports = postChannels