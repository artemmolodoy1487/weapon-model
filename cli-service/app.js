const inquirer = require('inquirer');
const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

let login_token = '';

async function main() {
    while (true) {
        const { action } = await inquirer.prompt([
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

        switch (action) {
            case 'Зарегистрировать нового пользователя':
                await registerUser();
                break;
            case 'Войти как существующий пользователь':
                await loginUser();
                break;
            case 'Проверить токен':
                await validateToken();
                break;
            case 'Создать оружие':
                await createWeapon();
                break;
            case 'Управление оружием':
                await manageWeapons();
                break;
            case 'Выход':
                console.log('Выход...');
                return;
            default:
                console.log('Неверный выбор.');
        }
    }
}

async function registerUser() {
    const { username, email, password } = await inquirer.prompt([
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
                if (!emailRegex.test(value)) {
                    return 'Введите корректный email.';
                }
                return true;
            },
        },
        {
            type: 'password',
            name: 'password',
            message: 'Введите пароль (минимум 6 символов):',
            validate: (value) => value.length >= 6 || 'Пароль должен содержать минимум 6 символов.',
        },
    ]);

    try {
        const response = await axios.post(`${BASE_URL}/register`, { username, email, password });
        console.log('Ответ сервера:', response.data);

        if (response.data.token) {
            login_token = response.data.token;
            console.log('Токен сохранен:', login_token);
        } else {
            console.log('Токен не найден в ответе сервера.');
        }
    } catch (error) {
        console.error('Ошибка:', error.response?.data || error.message);
    }
}

async function loginUser() {
    const { email, password } = await inquirer.prompt([
        {
            type: 'input',
            name: 'email',
            message: 'Введите email (формат: example@example.com):',
            validate: (value) => {
                const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (!emailRegex.test(value)) {
                    return 'Введите корректный email.';
                }
                return true;
            },
        },
        {
            type: 'password',
            name: 'password',
            message: 'Введите пароль (минимум 6 символов):',
            validate: (value) => value.length >= 6 || 'Пароль должен содержать минимум 6 символов.',
        },
    ]);

    try {
        const response = await axios.post(`${BASE_URL}/login`, { email, password });
        console.log('Ответ сервера:', response.data);

        if (response.data.token) {
            login_token = response.data.token;
            console.log('Токен сохранен:', login_token);
        } else {
            console.log('Токен не найден в ответе сервера.');
        }
    } catch (error) {
        console.error('Ошибка:', error.response?.data || error.message);
    }
}

async function validateToken() {
    const tokenToValidate = login_token || (await inquirer.prompt([
        {
            type: 'input',
            name: 'token',
            message: 'Введите токен (строка из букв и цифр):',
        },
    ])).token;

    try {
        const response = await axios.post(`${BASE_URL}/validate-token`, { token: tokenToValidate });
        console.log('Ответ сервера:', response.data);
    } catch (error) {
        console.error('Ошибка:', error.response?.data || error.message);
    }
}

async function createWeapon() {
    const { name, type, caliber, magazineCapacity, barrelLength, scopeMagnification } = await inquirer.prompt([
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

    try {
        const response = await axios.post(`${BASE_URL}/create-weapon`, {
            token: login_token,
            name,
            type,
            caliber,
            magazineCapacity: parseInt(magazineCapacity),
            barrelLength: parseInt(barrelLength),
            scopeMagnification: parseInt(scopeMagnification),
        });
        console.log('Ответ сервера:', response.data);
    } catch (error) {
        console.error('Ошибка:', error.response?.data || error.message);
    }
}

async function manageWeapons() {
    try {
        const response = await axios.get(`${BASE_URL}/weapons`, { params: { token: login_token } });
        const weapons = response.data;

        if (weapons.length === 0) {
            console.log('У вас нет оружия.');
            return;
        }

        const { weaponId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'weaponId',
                message: 'Выберите оружие для взаимодействия:',
                choices: weapons.map((weapon) => ({
                    name: `${weapon.name} (${weapon.type})`,
                    value: weapon._id,
                })),
            },
        ]);

        const { action } = await inquirer.prompt([
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
                    'Техническое обслуживание',
                    'Безопасное хранение',
                    'Купить патроны',
                    'Продать патроны',
                    'Проверить точность',
                    'Посмотреть состояние оружия',
                    'Назад',
                ],
            },
        ]);

        let apiAction;
        let payload = {};
        switch (action) {
            case 'Зарядить оружие':
                const { amountLoad } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'amountLoad',
                        message: 'Введите количество патронов для зарядки (целое число больше 0):',
                        validate: (value) => !isNaN(value) && value > 0 || 'Введите корректное число больше 0.',
                    },
                ]);
                apiAction = 'load';
                payload.amount = parseInt(amountLoad);
                break;
            case 'Выстрелить':
                apiAction = 'shoot';
                break;
            case 'Разрядить оружие':
                apiAction = 'unload';
                break;
            case 'Начать прицеливаться':
                apiAction = 'startAiming';
                break;
            case 'Перестать прицеливаться':
                apiAction = 'stopAiming';
                break;
            case 'Техническое обслуживание':
                apiAction = 'maintenance';
                break;
            case 'Безопасное хранение':
                apiAction = 'safeStorage';
                break;
            case 'Купить патроны':
                const { amountBuy } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'amountBuy',
                        message: 'Введите количество патронов для покупки (целое число больше 0):',
                        validate: (value) => !isNaN(value) && value > 0 || 'Введите корректное число больше 0.',
                    },
                ]);
                apiAction = 'buyAmmo';
                payload.amount = parseInt(amountBuy);
                break;
            case 'Продать патроны':
                const { amountSell } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'amountSell',
                        message: 'Введите количество патронов для продажи (целое число больше 0):',
                        validate: (value) => !isNaN(value) && value > 0 || 'Введите корректное число больше 0.',
                    },
                ]);
                apiAction = 'sellAmmo';
                payload.amount = parseInt(amountSell);
                break;
            case 'Проверить точность':
                apiAction = 'getAccuracy';
                break;
            case 'Посмотреть состояние оружия':
                apiAction = 'getState';
                break;
            case 'Назад':
                return;
        }

        const result = await axios.post(`${BASE_URL}/weapon/${weaponId}/action`, {
            action: apiAction,
            ...payload,
        });

        if (apiAction === 'getState') {
            console.log('Состояние оружия:', result.data);
        } else if (result.data.error) {
            console.error('Ошибка:', result.data.error);
        } else {
            console.log('Ответ сервера:', result.data.message);
        }
    } catch (error) {
        console.error('Ошибка:', error.response?.data?.error || error.message);
    }
}
main().catch((error) => {
    console.error('Произошла непредвиденная ошибка:', error);
});