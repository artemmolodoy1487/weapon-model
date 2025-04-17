class Ammunition {
    constructor(caliber, quantity = 0) {
        this.caliber = caliber;
        this.quantity = quantity;
    }

    getState() {
        return {
            caliber: this.caliber,
            quantity: this.quantity,
        };
    }

    useAmmo(amount) {
        if (amount <= 0) {
            return { error: 'Количество патронов должно быть больше 0' };
        }
        if (this.quantity < amount) {
            return { error: `Недостаточно патронов. Текущее количество: ${this.quantity}` };
        }
        this.quantity -= amount;
        return { message: `Использовано ${amount} патронов. Осталось: ${this.quantity}` };
    }

    buyAmmo(amount) {
        if (amount <= 0) {
            return { error: 'Количество патронов должно быть больше 0' };
        }
        this.quantity += amount;
        return { message: `Куплено ${amount} патронов. Общее количество: ${this.quantity}` };
    }

    sellAmmo(amount) {
        const result = this.useAmmo(amount);
        if (result.error) {
            return { error: result.error };
        }
        return { message: `Продано ${amount} патронов. Осталось: ${this.quantity}` };
    }
}

module.exports = Ammunition;