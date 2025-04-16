const Magazine = require('./Magazine');
const Barrel = require('./Barrel');
const Scope = require('./Scope');
const TriggerMechanism = require('./TriggerMechanism');
const Ammunition = require('./Ammunition');

class WeaponClass {
    constructor(data) {
        this.id = data._id;
        this.name = data.name;
        this.type = data.type;
        this.caliber = data.caliber;

        // Инициализация компонентов оружия
        this.magazine = new Magazine(data.magazineCapacity);
        this.barrel = new Barrel(data.barrelLength || 400);
        this.scope = data.scopeMagnification ? new Scope(data.scopeMagnification) : null;
        this.triggerMechanism = new TriggerMechanism();
        this.ammunition = new Ammunition(data.caliber, data.currentAmmo || 0);

        // Состояние прицеливания
        this.isAiming = data.isAiming;

        // Синхронизация начальных данных
        this.magazine.currentAmmo = data.currentAmmo || 0;
    }

    syncWithDatabase(weaponData) {
        this.magazine.currentAmmo = weaponData.currentAmmo;
        this.isAiming = weaponData.isAiming; // Синхронизация состояния прицеливания
        return this;
    }

    getState() {
        return {
            name: this.name,
            type: this.type,
            caliber: this.caliber,
            magazine: {
                capacity: this.magazine.capacity,
                currentAmmo: this.magazine.currentAmmo,
            },
            barrel: {
                length: this.barrel.length,
                accuracy: this.barrel.getAccuracy(),
            },
            scope: this.scope ? { magnification: this.scope.magnification } : 'Прицел не установлен',
            ammunition: {
                quantity: this.ammunition.quantity,
            },
            isAiming: this.isAiming,
        };
    }

    startAiming() {
        this.isAiming = true;
        return { message: 'Вы начали прицеливаться' };
    }

    stopAiming() {
        this.isAiming = false;
        return { message: 'Вы перестали прицеливаться' };
    }

    getAccuracy() {
        const baseAccuracy = this.barrel.getAccuracy();
        let totalAccuracy;
        if(this.isAiming == true){
            console.log('scope is on');
            console.log(this.isAiming);
            totalAccuracy = baseAccuracy * this.scope.magnification;
        }
        else{
            console.log(this.isAiming);
            console.log('scope is of');
            totalAccuracy = baseAccuracy;
        }
        return { message: `Точность оружия: ${totalAccuracy}` };
    }

    loadAmmo(amount) {
        return this.magazine.loadAmmo(amount);
    }

    unloadAmmo() {
        return this.magazine.unloadAmmo();
    }

    shoot() {
        const ammoResult = this.ammunition.useAmmo(1);
        if (ammoResult.error) {
            return { error: ammoResult.error };
        }

        this.triggerMechanism.pullTrigger();
        return this.magazine.shoot();
    }

    maintenance() {
        return { message: `Техническое обслуживание проведено для оружия ${this.name}` };
    }

    safeStorage() {
        this.magazine.unloadAmmo();
        return { message: `Оружие ${this.name} помещено на безопасное хранение` };
    }

    buyAmmo(amount) {
        this.ammunition.quantity += amount;
        return { message: `Куплено ${amount} патронов. Общее количество: ${this.ammunition.quantity}` };
    }

    sellAmmo(amount) {
        const result = this.ammunition.useAmmo(amount);
        if (result.error) {
            return { error: result.error };
        }
        return { message: `Продано ${amount} патронов. Осталось: ${this.ammunition.quantity}` };
    }
}

module.exports = WeaponClass;