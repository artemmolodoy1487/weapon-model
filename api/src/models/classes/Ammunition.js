class Ammunition {
    constructor(caliber, quantity) {
        this.caliber = caliber;
        this.quantity = quantity || 0;
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
}

module.exports = Ammunition;