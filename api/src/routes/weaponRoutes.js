const express = require('express');
const { createWeapon, manageWeapon, getWeapons } = require('../controllers/weaponController');
const authenticateUser = require('../middlewares/authenticateUser');
const router = express.Router();

router.post('/create-weapon', authenticateUser, createWeapon);
router.post('/weapon/:id/action', authenticateUser, manageWeapon);
router.get('/weapons', authenticateUser, getWeapons);

module.exports = router;