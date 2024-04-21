const ChannelCrud = require("../../../model/channel");
const {Channel} = require("../../../model");

async function createChannelDb(channelInfo) {
    try {
        const newChannel = new Channel(channelInfo);
        await newChannel.save()
    } catch (error) {
        throw new Error(`ERROR: ${error}`)
    }
}
async function saveChannelDb(channelInfo) {
    try {
        await createChannelDb(channelInfo)
    } catch (error) {
        throw new Error(`ERROR: ${error}`)
    }
}

async function getAllChannels (props) {
    try {
        const channels = await Channel.find(props)
        return channels
    } catch (error) {
        throw new Error(`ERROR: ${error}`)
    }
}

async function getChannel (props) {
    try {
        const channel = await Channel.findOne(props)
        return channel
    } catch (error) {
        throw new Error(`ERROR: ${error}`)
    }
}
async function deleteChannelDb(props) {
    try {
        const channel = await Channel.deleteOne(props)
        return channel
    } catch (error) {
        throw new Error(`ERROR: ${error}`)
    }
}

module.exports = {
    saveChannelDb,
    getChannel,
    getAllChannels,
    deleteChannelDb
}