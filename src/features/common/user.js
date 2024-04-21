const { User } = require('../../../model')

async function getAllUsers (props) {
    try {
        const users = await User.find(props)
        return users
    } catch (error) {
        throw new Error(`ERROR: ${error}`)
    }
}

async function findUser (propObj) {
    try {
        if (!propObj) {
            throw Error('Userni topish uchun Property kiriting')
        }
        const user = await User.findOne(propObj)
        return user
    } catch (error) {
        throw new Error(`ERROR: ${error}`)
    }
}

async function createUser (chatId, action) {
    try {
        if (!chatId) {
            throw Error('Userni yaratish uchun chatId kiriting')
        }

        const user = new User({
            chatId: chatId,
            action: action || 'menu'
        });
        await user.save();
        return user
    } catch (error) {
        throw new Error(`ERROR: ${error}`)
    }
}

async function updateUser (_id, value) {
    try {
        if (!_id) {
            throw Error('Userni yangilash uchun ID kiriting')
        } else if (!value) {
            throw Error('Userni yangilash uchun VALUE kiriting')
        }
        const newUser = await User.findByIdAndUpdate(
            {_id},
            value,
            { new:true }
        )
        return newUser
    } catch (error) {
        throw new Error(`ERROR: ${error}`)
    }
}

async function deleteUser (_id) {
    try {
        if (!_id) {
            throw Error("Userni o'chirish uchun ID kiriting")
        }
        const user = await User.findByIdAndDelete(_id)
        return user
    } catch (error) {
        throw new Error(`ERROR: ${error}`)
    }
}

module.exports = {
    getAllUsers,
    findUser,
    createUser,
    updateUser,
    deleteUser
}