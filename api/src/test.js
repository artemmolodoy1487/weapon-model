const WeaponClass = require('./models/classes/WeaponClass');
const Ammunition = require('./models/classes/Ammunition');
const Barrel = require('./models/classes/Barrel');

describe('WeaponClass', () => {
    let weapon;

    beforeEach(() => {
        const data = {
            _id: '123',
            name: 'Test Weapon',
            type: 'rifle',
            caliber: '7.62mm',
            magazineCapacity: 30,
            barrelLength: 500,
            scopeMagnification: 4,
            currentAmmo: 10,
            isAiming: false,
        };
        weapon = new WeaponClass(data);
    });

    test('should initialize with correct properties', () => {
        expect(weapon.name).toBe('Test Weapon');
        expect(weapon.type).toBe('rifle');
        expect(weapon.caliber).toBe('7.62mm');
        expect(weapon.magazine.capacity).toBe(30);
        expect(weapon.magazine.currentAmmo).toBe(10);
        expect(weapon.barrel.length).toBe(500);
        expect(weapon.scope.magnification).toBe(4);
        expect(weapon.isAiming).toBe(false);
    });

    test('should start aiming', () => {
        const result = weapon.startAiming();
        expect(result.message).toBe('Вы начали прицеливаться');
        expect(weapon.isAiming).toBe(true);
    });

    test('should stop aiming', () => {
        weapon.startAiming(); // Сначала начнем прицеливание
        const result = weapon.stopAiming();
        expect(result.message).toBe('Вы перестали прицеливаться');
        expect(weapon.isAiming).toBe(false);
    });

    test('should calculate accuracy correctly', () => {
        const accuracyWithoutScope = weapon.getAccuracy();
        expect(accuracyWithoutScope.message).toBe('Точность оружия: 500');

        weapon.startAiming();
        const accuracyWithScope = weapon.getAccuracy();
        expect(accuracyWithScope.message).toBe('Точность оружия: 2000'); // 500 * 4
    });

    test('should load ammo correctly', () => {
        const result = weapon.loadAmmo(5);
        expect(result.message).toBe("Заряжено 5 патронов. Текущее количество: 15");
        expect(weapon.magazine.currentAmmo).toBe(15); // 10 + 5
    });

    test('should unload ammo correctly', () => {
        const result = weapon.unloadAmmo();
        expect(result.message).toBe('Разряжено 10 патронов');
        expect(weapon.magazine.currentAmmo).toBe(0);
    });

    test('should shoot correctly', () => {
        const result = weapon.shoot();
        expect(result.message).toBe('Выстрел произведен. Осталось патронов: 9');
        expect(weapon.magazine.currentAmmo).toBe(9); // 10 - 1
    });

    test('should perform maintenance correctly', () => {
        const result = weapon.maintenance();
        expect(result.message).toBe('Техническое обслуживание проведено для оружия Test Weapon');
        expect(weapon.ammunition.quantity).toBe(110); // Куплено 100 патронов
        expect(weapon.magazine.currentAmmo).toBe(0); // Магазин разряжен
        expect(weapon.isAiming).toBe(false); // Прицеливание отключено
    });

    test('should handle safe storage correctly', () => {
        const result = weapon.safeStorage();
        expect(result.message).toBe('Оружие Test Weapon помещено на безопасное хранение');
        expect(weapon.magazine.currentAmmo).toBe(0);
    });

    test('should buy and sell ammo correctly', () => {
        const buyResult = weapon.buyAmmo(50);
        expect(buyResult.message).toBe('Куплено 50 патронов. Общее количество: 60');

        const sellResult = weapon.sellAmmo(20);
        expect(sellResult.message).toBe('Продано 20 патронов. Осталось: 40');
    });
});