const axios = require('axios');
const logger = require('../utils/logger');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const apiClient = {
    async registerUser(userData) {
        try {
            const response = await axios.post(`${BASE_URL}/register`, userData);
            logger.info('Пользователь успешно зарегистрирован.');
            return response.data;
        } catch (error) {
            logger.error('Ошибка регистрации:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error || error.message);
        }
    },

    async loginUser(credentials) {
        try {
            const response = await axios.post(`${BASE_URL}/login`, credentials);
            logger.info('Пользователь успешно вошел.');
            return response.data;
        } catch (error) {
            logger.error('Ошибка входа:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error || error.message);
        }
    },

    async createWeapon(token, weaponData) {
        try {
            const response = await axios.post(`${BASE_URL}/create-weapon`, { token, ...weaponData });
            logger.info('Оружие успешно создано.');
            return response.data;
        } catch (error) {
            logger.error('Ошибка создания оружия:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error || error.message);
        }
    },

    async manageWeapon(token, weaponId, action, payload = {}) {
        try {
            const response = await axios.post(`${BASE_URL}/weapon/${weaponId}/action`, { token, action, ...payload });
            logger.info(`Действие "${action}" выполнено.`);
            return response.data;
        } catch (error) {
            logger.error(`Ошибка выполнения действия "${action}":`, error.response?.data || error.message);
            throw new Error(error.response?.data?.error || error.message);
        }
    },

    async getWeapons(token) {
        try {
            const response = await axios.get(`${BASE_URL}/weapons`, { params: { token } });
            logger.info('Оружие успешно получено.');
            return response.data;
        } catch (error) {
            logger.error('Ошибка получения оружия:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error || error.message);
        }
    },
};

module.exports = apiClient;