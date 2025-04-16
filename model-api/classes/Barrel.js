class Barrel {
    constructor(length) {
        this.length = length; // Длина ствола в мм
    }

    getAccuracy() {
        // Чем длиннее ствол, тем выше точность
        return this.length; // Пример расчета точности
    }
}

module.exports = Barrel;