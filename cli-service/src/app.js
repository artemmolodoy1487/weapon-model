const prompts = require('./cli/prompts');
const apiClient = require('./api/apiClient');

async function main() {
    let token = null;

    // Маппинг русскоязычных названий действий на английские для сервера
    const actionMapping = {
        'Зарядить оружие': 'load',
        'Выстрелить': 'shoot',
        'Разрядить оружие': 'unload',
        'Начать прицеливаться': 'startAiming',
        'Перестать прицеливаться': 'stopAiming',
        'Безопасное хранение': 'safeStorage',
        'Купить патроны': 'buyAmmo',
        'Продать патроны': 'sellAmmo',
        'Проверить точность': 'getAccuracy',
        'Посмотреть состояние оружия': 'getState',
    };

    while (true) {
        try {
            const action = await prompts.mainMenu();
            let action_str = action.action;

            switch (action_str) {
                case 'Зарегистрировать нового пользователя': {
                    const userData = await prompts.registerUser();
                    const result = await apiClient.registerUser(userData);
                    if (!result.success) {
                        console.error(`Ошибка регистрации: ${result.error}`);
                    } else {
                        console.log('Пользователь успешно зарегистрирован.');
                    }
                    break;
                }

                case 'Войти как существующий пользователь': {
                    const credentials = await prompts.loginUser();
                    const result = await apiClient.loginUser(credentials);
                    if (!result.success) {
                        console.error(`Ошибка входа: ${result.error}`);
                    } else {
                        token = result.data.token;
                        console.log('Вы успешно вошли.');
                    }
                    break;
                }

                case 'Проверить токен': {
                    if (!token) {
                        console.log('Сначала войдите в систему.');
                        break;
                    }
                    const result = await apiClient.validateToken(token);
                    if (!result.success) {
                        console.error(`Ошибка валидации токена: ${result.error}`);
                    } else {
                        console.log('Токен действителен.');
                    }
                    break;
                }

                case 'Создать оружие': {
                    if (!token) {
                        console.log('Сначала войдите в систему.');
                        break;
                    }
                    const weaponData = await prompts.createWeapon();
                    const result = await apiClient.createWeapon(token, weaponData);
                    if (!result.success) {
                        console.error(`Ошибка создания оружия: ${result.error}`);
                    } else {
                        console.log('Оружие успешно создано.');
                    }
                    break;
                }

                case 'Управление оружием': {
                    if (!token) {
                        console.log('Сначала войдите в систему.');
                        break;
                    }
                    const weaponsResult = await apiClient.getWeapons(token);
                    if (!weaponsResult.success) {
                        console.error(`Ошибка получения оружия: ${weaponsResult.error}`);
                        break;
                    }
                    const weapons = weaponsResult.data;
                    const { weaponId, action: selectedAction } = await prompts.manageWeapons(weapons);

                    if (selectedAction === 'Назад') {
                        break;
                    }

                    // Преобразуем название действия для сервера
                    const serverAction = actionMapping[selectedAction];
                    if (!serverAction) {
                        if(selectedAction == 'Назад'){
                            console.error('Действие назад');
                        }
                        else{
                            
                        }
                        break;
                    }

                    // Получаем детали действия (например, количество патронов)
                    const details = await prompts.promptActionDetails(selectedAction);

                    // Отправляем запрос на выполнение действия
                    const result = await apiClient.manageWeapon(token, weaponId, serverAction, details);
                    if (!result.success) {
                        console.error(`Ошибка выполнения действия "${selectedAction}": ${result.error}`);
                    } else {
                        console.log(`Действие "${selectedAction}" выполнено.`);
                        console.log(result.data);
                    }
                    break;
                }

                case 'Выход':
                    console.log('Выход...');
                    return;

                default:
                    console.log(`Неверный выбор: "${action}"`);
            }
        } catch (error) {
            console.error('Произошла непредвиденная ошибка:', error.message);
        }
    }
}

main();