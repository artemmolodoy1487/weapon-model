const inquirer = require('inquirer');

const prompts = {
    async mainMenu() {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Выберите действие:',
                choices: [
                    'Зарегистрировать нового пользователя',
                    'Войти как существующий пользователь',
                    'Проверить токен',
                    'Создать оружие',
                    'Управление оружием',
                    'Выход',
                ],
            },
        ]);
    },

    async registerUser() {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'username',
                message: 'Введите имя пользователя:',
            },
            {
                type: 'input',
                name: 'email',
                message: 'Введите email (формат: example@example.com):',
                validate: (value) => {
                    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    return emailRegex.test(value) || 'Введите корректный email.';
                },
            },
            {
                type: 'password',
                name: 'password',
                message: 'Введите пароль (минимум 6 символов):',
                validate: (value) => value.length >= 6 || 'Пароль должен содержать минимум 6 символов.',
            },
        ]);
    },

    async loginUser() {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'email',
                message: 'Введите email (формат: example@example.com):',
                validate: (value) => {
                    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    return emailRegex.test(value) || 'Введите корректный email.';
                },
            },
            {
                type: 'password',
                name: 'password',
                message: 'Введите пароль (минимум 6 символов):',
                validate: (value) => value.length >= 6 || 'Пароль должен содержать минимум 6 символов.',
            },
        ]);
    },

    async createWeapon() {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Введите название оружия:',
            },
            {
                type: 'list',
                name: 'type',
                message: 'Выберите тип оружия:',
                choices: ['pistol', 'rifle', 'shotgun', 'sniper'],
            },
            {
                type: 'input',
                name: 'caliber',
                message: 'Введите калибр (например, 9mm или 5.56):',
            },
            {
                type: 'input',
                name: 'magazineCapacity',
                message: 'Введите вместимость магазина (целое число больше 0):',
                validate: (value) => !isNaN(value) && value > 0 || 'Введите корректное число больше 0.',
            },
            {
                type: 'input',
                name: 'barrelLength',
                message: 'Введите длину ствола в мм (целое число больше 0):',
                validate: (value) => !isNaN(value) && value > 0 || 'Введите корректное число больше 0.',
            },
            {
                type: 'input',
                name: 'scopeMagnification',
                message: 'Введите увеличение прицела (например, 4x, целое число >= 0):',
                validate: (value) => !isNaN(value) && value >= 0 || 'Введите корректное число >= 0.',
            },
        ]);
    },

    async manageWeapons(weapons) {
        const weaponChoices = weapons.map((weapon) => ({
            name: `${weapon.name} (${weapon.type})`,
            value: weapon._id,
        }));

        return inquirer.prompt([
            {
                type: 'list',
                name: 'weaponId',
                message: 'Выберите оружие для взаимодействия:',
                choices: [...weaponChoices, new inquirer.Separator(), 'Назад'],
            },
            {
                type: 'list',
                name: 'action',
                message: 'Выберите действие:',
                choices: [
                    'Зарядить оружие',
                    'Выстрелить',
                    'Разрядить оружие',
                    'Начать прицеливаться',
                    'Перестать прицеливаться',
                    'Безопасное хранение',
                    'Купить патроны',
                    'Продать патроны',
                    'Проверить точность',
                    'Посмотреть состояние оружия',
                    'Назад',
                ],
                when: (answers) => answers.weaponId !== 'Назад',
            },
        ]);
    },

    async promptActionDetails(action) {
        switch (action) {
            case 'Зарядить оружие':
            case 'Купить патроны':
            case 'Продать патроны':
                return inquirer.prompt([
                    {
                        type: 'input',
                        name: 'amount',
                        message: `Введите количество ${action === 'Зарядить оружие' ? 'патронов для зарядки' : action === 'Купить патроны' ? 'патронов для покупки' : 'патронов для продажи'}:`,
                        validate: (value) => !isNaN(value) && value > 0 || 'Введите корректное число больше 0.',
                    },
                ]);

            default:
                return {};
        }
    },
};

module.exports = prompts;