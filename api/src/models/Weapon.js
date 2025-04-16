const mongoose = require('mongoose');

const weaponSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['pistol', 'rifle', 'shotgun', 'sniper'], required: true },
    caliber: { type: String, required: true },
    magazineCapacity: { type: Number, required: true },
    barrelLength: { type: Number, default: 400 },
    scopeMagnification: { type: Number, default: null },
    currentAmmo: { type: Number, default: 0 },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isAiming: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Weapon', weaponSchema);