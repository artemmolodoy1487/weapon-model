class Magazine {
    constructor(capacity) {
        this.capacity = capacity;
        this.currentAmmo = 0;
    }

    getState() {
        return {
            capacity: this.capacity,
            currentAmmo: this.currentAmmo,
        };
    }

    hasAmmo() {
        return this.currentAmmo > 0;
    }

    loadAmmo(amount) {
        if (amount <= 0) {
            return { error: 'Количество патронов должно быть больше 0' };
        }
        if (this.currentAmmo + amount > this.capacity) {
            return { error: `Превышена вместимость магазина (${this.capacity})` };
        }
        this.currentAmmo += amount;
        return { message: `Заряжено ${amount} патронов. Текущее количество: ${this.currentAmmo}` };
    }

    unloadAmmo() {
        const unloadedAmmo = this.currentAmmo;
        this.currentAmmo = 0;
        return { message: `Разряжено ${unloadedAmmo} патронов` };
    }

    shoot() {
        if (!this.hasAmmo()) {
            return { error: 'Нет патронов для стрельбы' };
        }
        this.currentAmmo -= 1;
        return { message: `Выстрел произведен. Осталось патронов: ${this.currentAmmo}` };
    }
}

module.exports = Magazine;