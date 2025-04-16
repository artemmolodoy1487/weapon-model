const express = require('express');
const mongoose = require('mongoose');
const User = require('../orm/user_schema');
const Weapon = require('../orm/weapon_schema');
const WeaponClass = require('../classes/WeaponClass');

const router = express.Router();

// Создание нового оружия
router.post('/create-weapon', async (req, res) => {
    try {
        const { token, name, type, caliber, magazineCapacity, barrelLength, scopeMagnification } = req.body;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(401).json({ error: 'Неверный токен' });
        }

        const newWeapon = new Weapon({
            name,
            type,
            caliber,
            magazineCapacity,
            barrelLength,
            scopeMagnification,
            ownerId: user._id,
        });

        await newWeapon.save();
        res.status(201).json({ message: 'Оружие успешно создано', weapon: newWeapon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера при создании оружия' });
    }
});

router.post('/weapon/:id/action', async (req, res) => {
    try {
        const { id } = req.params;
        const { action, amount } = req.body;

        const weaponData = await Weapon.findById(id);
        if (!weaponData) {
            return res.status(404).json({ error: 'Оружие не найдено' });
        }

        const weaponInstance = new WeaponClass(weaponData);

        let result;
        console.log(action);
        switch (action) {
            case 'load':
                result = weaponInstance.loadAmmo(amount);
                weaponData.currentAmmo = weaponInstance.magazine.currentAmmo;
                break;
            case 'unload':
                result = weaponInstance.unloadAmmo();
                weaponData.currentAmmo = weaponInstance.magazine.currentAmmo;
                break;
            case 'shoot':
                result = weaponInstance.shoot();
                if (result.error) {
                    return res.status(400).json({ error: result.error });
                }
                weaponData.currentAmmo = weaponInstance.magazine.currentAmmo;
                break;
            case 'startAiming':
                result = weaponInstance.startAiming();
                weaponData.isAiming = weaponInstance.isAiming; // Сохраняем состояние прицеливания
                break;
            case 'stopAiming':
                result = weaponInstance.stopAiming();
                weaponData.isAiming = weaponInstance.isAiming; // Сохраняем состояние прицеливания
                break;
            case 'maintenance':
                result = weaponInstance.maintenance();
                break;
            case 'safeStorage':
                result = weaponInstance.safeStorage();
                weaponData.currentAmmo = weaponInstance.magazine.currentAmmo;
                break;
            case 'buyAmmo':
                result = weaponInstance.buyAmmo(amount);
                weaponData.currentAmmo = weaponInstance.ammunition.quantity;
                break;
            case 'sellAmmo':
                result = weaponInstance.sellAmmo(amount);
                if (result.error) {
                    return res.status(400).json({ error: result.error });
                }
                weaponData.currentAmmo = weaponInstance.ammunition.quantity;
                break;
            case 'getAccuracy':
                result = weaponInstance.getAccuracy();
                break;
            case 'getState':
                console.log('Данные из базы перед синхронизацией:', weaponData);
                weaponInstance.syncWithDatabase(weaponData); // Синхронизация данных
                console.log('Данные после синхронизации:', weaponInstance);
                console.log('Текущее состояние оружия:', weaponInstance.getState());
                result = weaponInstance.getState();
                break;
            default:
                return res.status(400).json({ error: 'Неверное действие' });
        }

        console.log('Данные перед сохранением:', weaponData);
        await Weapon.findOneAndUpdate(
            { _id: weaponData._id },
            { $set: { isAiming: weaponData.isAiming, currentAmmo: weaponData.currentAmmo } }
        );

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера при выполнении действия с оружием' });
    }
});

// Получение всех оружий пользователя
router.get('/weapons', async (req, res) => {
    try {
        const { token } = req.query;

        // Проверка токена
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(401).json({ error: 'Неверный токен' });
        }

        // Поиск оружия, связанного с пользователем
        const weapons = await Weapon.find({ ownerId: user._id });
        res.status(200).json(weapons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера при получении оружий' });
    }
});

module.exports = router;