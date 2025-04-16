const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const crypto = require('crypto');

const weaponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['pistol', 'rifle', 'shotgun', 'sniper'],
        required: true,
    },
    caliber: {
        type: String,
        required: true,
    },
    magazineCapacity: {
        type: Number,
        required: true,
    },
    barrelLength: {
        type: Number,
        default: 400,
    },
    scopeMagnification: {
        type: Number,
        default: null,
    },
    currentAmmo: {
        type: Number,
        default: 0,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isAiming: {
        type: Boolean,
        default: false, 
    },
});

module.exports = mongoose.model('Weapon', weaponSchema);