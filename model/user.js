const { Schema, model } = require('mongoose')

const User = new Schema({
    full_name: String,
    chatId: Number,
    phone: String,
    createdAt: Date,
    action:String,
    status: {
        type: Number,
        default: 0
        //   0 = To'liq ro'yxatdan o'tmagan
        //   1 = To'liq ro'yxatdan o'tgan
    },
    role:{
        type:String,
        default:'USER'
    },
    isSeller:Object,
    active:{
        type: Number,
        default: 0
        //   0 = Admin tomonidan tasdiqlanmagan
        //   1 = Admin tomonidan tasdiqlangan
    }
})

module.exports = model('User', User)