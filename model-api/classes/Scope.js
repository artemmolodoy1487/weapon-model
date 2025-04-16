class Scope {
    constructor(magnification) {
        this.magnification = magnification; // Увеличение прицела
    }

    aim() {
        return { message: `Прицеливание выполнено с увеличением x${this.magnification}` };
    }
}

module.exports = Scope;