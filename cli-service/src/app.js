const prompts = require('./cli/prompts');
const actions = require('./cli/actions');

async function main() {
    while (true) {
        const action = await prompts.mainMenu();
        let action_str = action.action;

        switch (action_str) {
            case 'Зарегистрировать нового пользователя':
                await actions.registerUser();
                break;
            case 'Войти как существующий пользователь':
                await actions.loginUser();
                break;
            case 'Создать оружие':
                await actions.createWeapon();
                break;
            case 'Управление оружием':
                await actions.manageWeapons();
                break;
            case 'Выход':
                console.log('Выход...');
                return;
            default:
                console.log(`Неверный выбор: "${action}"`);
        }
    }
}

main().catch((error) => {
    console.error('Произошла непредвиденная ошибка:', error);
});