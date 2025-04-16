const request = require('supertest');
const app = require('../app');

let server;
let token;
let weaponId;

jest.setTimeout(10000); // Увеличиваем таймаут до 10 секунд

beforeAll((done) => {
    server = app.listen(3000, () => {
        console.log('Тестовый сервер запущен на порту 3000');
        done();
    });
}, 10000);

afterAll(async (done) => {
    await app.disconnect();
    server.close(() => {
        console.log('Тестовый сервер остановлен');
        done();
    });
}, 10000);

describe('Weapon API', () => {
    it('should load ammo into the weapon', async () => {
        const response = await request(app)
            .post(`/weapon/${weaponId}/action`)
            .send({ 
                action: 'load', 
                amount: 10,
                token: '5eb7b70b664151c6c59c2276379b5a061f72f225bc2c727de20471d906ba5d23', // Токен передается в теле запроса
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toContain('Заряжено');
    });
    
    it('should shoot the weapon', async () => {
        const response = await request(app)
            .post(`/weapon/${weaponId}/action`)
            .send({ 
                action: 'shoot',
                token: '5eb7b70b664151c6c59c2276379b5a061f72f225bc2c727de20471d906ba5d23', // Токен передается в теле запроса
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toContain('Выстрел');
    });
    
    it('should aim the weapon', async () => {
        const response = await request(app)
            .post(`/weapon/${weaponId}/action`)
            .send({ 
                action: 'startAiming',
                token: '5eb7b70b664151c6c59c2276379b5a061f72f225bc2c727de20471d906ba5d23', // Токен передается в теле запроса
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Вы начали прицеливаться');
    });
    
    it('should get the weapon state', async () => {
        const response = await request(app)
            .post(`/weapon/${weaponId}/action`)
            .send({ 
                action: 'getState',
                token: 'login_token', // Токен передается в теле запроса
            });
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Test Rifle');
        expect(response.body.isAiming).toBeDefined();
    });
});