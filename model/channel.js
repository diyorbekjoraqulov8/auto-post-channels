const { Schema, model } = require('mongoose')

const Channel = new Schema({
    channelName: String,
    channelId: String,
    channelUserName: String,
    status:{
        type:String,
        default:'channel'
    }
})

module.exports = model('Channel', Channel)