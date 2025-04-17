const Weapon = require('../models/Weapon');
const WeaponClass = require('../models/classes/WeaponClass');

exports.createWeapon = async (req, res) => {
    try {
        const { name, type, caliber, magazineCapacity, barrelLength, scopeMagnification } = req.body;
        const ownerId = req.user._id; // Теперь req.user определен благодаря middleware

        // Создание нового оружия
        const newWeapon = new Weapon({
            name,
            type,
            caliber,
            magazineCapacity,
            barrelLength,
            scopeMagnification,
            ownerId,
        });

        await newWeapon.save();
        res.status(201).json({ message: 'Оружие успешно создано', weapon: newWeapon });
    } catch (error) {
        console.error('Ошибка создания оружия:', error.message);
        res.status(500).json({ error: 'Ошибка сервера при создании оружия' });
    }
};

exports.manageWeapon = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, amount } = req.body;

        // Поиск оружия
        const weaponData = await Weapon.findById(id);
        if (!weaponData) {
            return res.status(404).json({ error: 'Оружие не найдено' });
        }

        // Создание экземпляра класса WeaponClass
        const weaponInstance = new WeaponClass(weaponData);

        let result;
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
                weaponData.isAiming = weaponInstance.isAiming;
                break;
            case 'stopAiming':
                result = weaponInstance.stopAiming();
                weaponData.isAiming = weaponInstance.isAiming;
                break;
            case 'maintenance':
                result = weaponInstance.maintenance();
                weaponInstance.syncWithDatabase(weaponData);
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
                weaponInstance.syncWithDatabase(weaponData);
                result = weaponInstance.getState();
                break;
            default:
                return res.status(400).json({ error: 'Неверное действие' });
        }

        // Сохранение изменений в базе данных
        await weaponData.save();
        res.status(200).json(result);
    } catch (error) {
        console.error('Ошибка управления оружием:', error.message);
        res.status(500).json({ error: 'Ошибка сервера при выполнении действия с оружием' });
    }
};

exports.getWeapons = async (req, res) => {
    try {
        const ownerId = req.user._id;

        // Поиск оружия, связанного с пользователем
        const weapons = await Weapon.find({ ownerId });
        res.status(200).json(weapons);
    } catch (error) {
        console.error('Ошибка получения оружий:', error.message);
        res.status(500).json({ error: 'Ошибка сервера при получении оружий' });
    }
};