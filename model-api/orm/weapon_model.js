const mongoose = require('mongoose');

const weaponSchema = new mongoose.Schema({
    user_login_token: {
        type: String,
        required: true,
        unique: false
    },
    id: {
        type: String,
        required: true,
        unique: true,
        lowercase: false,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Введите корректный email']
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },
    loginToken: {
        type: String,
        unique: true,
        default: () => crypto.randomBytes(16).toString('hex')
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
