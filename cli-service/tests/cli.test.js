const { execute } = require('inquirer-testing');
const { main } = require('../app'); // Путь к вашему CLI-приложению
const axios = require('axios');

jest.mock('axios');

describe('CLI Tests', () => {
    beforeEach(() => {
        axios.post.mockReset();
        axios.get.mockReset();
    });

    it('should register a new user', async () => {
        axios.post.mockResolvedValueOnce({ data: { token: 'mocked-token' } });

        const inputs = ['Зарегистрировать нового пользователя', 'testuser', 'test@example.com', 'password123'];
        const output = await execute(main, inputs);

        expect(output).toContain('Токен сохранен:');
        expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/register'), {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        });
    });

    it('should login an existing user', async () => {
        axios.post.mockResolvedValueOnce({ data: { token: 'mocked-token' } });

        const inputs = ['Войти как существующий пользователь', 'test@example.com', 'password123'];
        const output = await execute(main, inputs);

        expect(output).toContain('Токен сохранен:');
        expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/login'), {
            email: 'test@example.com',
            password: 'password123',
        });
    });

    it('should create a weapon', async () => {
        axios.post.mockResolvedValueOnce({ data: { weapon: { _id: 'mocked-weapon-id' } } });

        const inputs = [
            'Создать оружие',
            'Test Rifle',
            'rifle',
            '7.62',
            '30',
            '400',
            '4',
        ];
        const output = await execute(main, inputs);

        expect(output).toContain('Ответ сервера:');
        expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/create-weapon'), {
            token: expect.any(String),
            name: 'Test Rifle',
            type: 'rifle',
            caliber: '7.62',
            magazineCapacity: 30,
            barrelLength: 400,
            scopeMagnification: 4,
        });
    });
});