const axios = require('axios');
const logger = require('../utils/logger');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const apiClient = {
    async registerUser(userData) {
        try {
            const response = await axios.post(`${BASE_URL}/register`, userData);
            logger.info('Пользователь успешно зарегистрирован.');
            return { success: true, data: response.data };
        } catch (error) {
            logger.error('Ошибка регистрации:', error.response?.data || error.message);
            return { success: false, error: error.response?.data?.error || error.message };
        }
    },

    async loginUser(credentials) {
        try {
            const response = await axios.post(`${BASE_URL}/login`, credentials);
            logger.info('Пользователь успешно вошел.');
            return { success: true, data: response.data };
        } catch (error) {
            logger.error('Ошибка входа:', error.response?.data || error.message);
            return { success: false, error: error.response?.data?.error || error.message };
        }
    },

    async validateToken(token) {
        try {
            const response = await axios.post(`${BASE_URL}/validate-token`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            logger.info('Токен действителен.');
            return { success: true, data: response.data };
        } catch (error) {
            logger.error('Ошибка валидации токена:', error.response?.data || error.message);
            return { success: false, error: error.response?.data?.error || error.message };
        }
    },

    async createWeapon(token, weaponData) {
        try {
            const response = await axios.post(`${BASE_URL}/create-weapon`, weaponData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            logger.info('Оружие успешно создано.');
            return { success: true, data: response.data };
        } catch (error) {
            logger.error('Ошибка создания оружия:', error.response?.data || error.message);
            return { success: false, error: error.response?.data?.error || error.message };
        }
    },

    async getWeapons(token) {
        try {
            const response = await axios.get(`${BASE_URL}/weapons`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            logger.info('Оружие успешно получено.');
            return { success: true, data: response.data };
        } catch (error) {
            logger.error('Ошибка получения оружия:', error.response?.data || error.message);
            return { success: false, error: error.response?.data?.error || error.message };
        }
    },

    async manageWeapon(token, weaponId, action, payload = {}) {
        try {
            const response = await axios.post(`${BASE_URL}/weapon/${weaponId}/action`, { action, ...payload }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            logger.info(`Действие "${action}" выполнено.`);
            return { success: true, data: response.data };
        } catch (error) {
            logger.error(`Ошибка выполнения действия "${action}":`, error.response?.data || error.message);
            return { success: false, error: error.response?.data?.error || error.message };
        }
    },
};

module.exports = apiClient;