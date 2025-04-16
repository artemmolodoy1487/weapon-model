const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, 
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Введите корректный email']
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        select: false 
    },
    token: {
        type: String,
        unique: true,
        default: () => crypto.randomBytes(32).toString('hex') // Увеличим длину токена
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;