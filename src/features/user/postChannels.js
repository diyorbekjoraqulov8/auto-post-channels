const {updateUser} = require("../common/user");
const {getAllChannels} = require("./channelCrud");

function replaceAtOffset(str, offset, length, replacement) {
    const before = str.substring(0, offset);
    const after = str.substring(offset + length);
    return before + replacement + after;
}

function textToLink(entities = [], mainText) {
    let result = []
    for (let entity of entities) {
        if (entity.type === 'text_link') {
            const url = entity.url;
            const offset = entity.offset;
            const length = entity.length;
            const text = mainText?.substring(offset, offset + length);

            result.push({
                offset,
                length,
                link: `<a href="${url}">${text}</a>`
            })
        }
    }

    return result
}

async function generatePost(type, ctx) {
    const message = ctx.message
    if (type === 'text') {
        let text = ctx.message.text

        const replacements = textToLink(message.entities, text)

        replacements.sort((a, b) => b.offset - a.offset).forEach(replacement => {
            text = replaceAtOffset(text, replacement.offset, replacement.length, replacement.link);
        });

        return text
    } else if (type === 'photo' || type === 'video' || type === 'document' || type === 'audio') {
        let caption = ctx.message.caption

        const replacements = textToLink(message.caption_entities, caption)

        replacements.sort((a, b) => b.offset - a.offset).forEach(replacement => {
            caption = replaceAtOffset(caption, replacement.offset, replacement.length, replacement.link);
        });
        return caption
    }
}

async function postSender(channelId, type, postText, ctx) {
    if (type === 'text') {
        const reply_markup = ctx.message?.reply_markup

        await ctx.telegram.sendMessage(channelId, postText, {
            reply_markup,
            parse_mode: 'HTML'
        });
    } else if (type === 'photo') {
        const imageFileId = ctx.message.photo[0]?.file_id
        const reply_markup = ctx.message.reply_markup

        await ctx.telegram.sendPhoto(channelId, imageFileId, {
            caption: postText,
            reply_markup,
            parse_mode: 'HTML'
        });
    } else if (type === 'video') {
        const videoFileId = ctx.message.video.file_id
        const reply_markup = ctx.message.reply_markup

        await ctx.telegram.sendVideo(channelId, videoFileId, {
            caption: postText,
            reply_markup,
            parse_mode: 'HTML'
        });

    } else if (type === 'audio') {
        const audioFileId = ctx.message.audio.file_id
        const reply_markup = ctx.message.reply_markup
        await ctx.telegram.sendDocument(channelId, audioFileId, {
            caption: postText,
            reply_markup,
            parse_mode: 'HTML'
        });
    } else if (type === 'document') {
        const docFileId = ctx.message.document.file_id
        const reply_markup = ctx.message.reply_markup
        await ctx.telegram.sendDocument(channelId, docFileId, {
            caption: postText,
            reply_markup,
            parse_mode: 'HTML'
        });
    }
}

async function sendPostChannels(user, type, ctx) {
    try {
        const channels = await getAllChannels()
        if (channels?.length) {
            let success = `✅ Post joylandi\n\n`
            let failed = `\n❌ Post joylanmadi\n\n`
            const postText = await generatePost(type, ctx)
            for (let i = 0; i < channels.length; i++) {
                if(channels[i].status === 'supergroup' || channels[i]?.canPostMessages) {
                    success += `${i+1}) ${channels[i].channelName} @${channels[i].channelUserName}\n`

                    await postSender(channels[i].channelId, type, postText, ctx)
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
        console.log(error)
        // throw Error(error.message)
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