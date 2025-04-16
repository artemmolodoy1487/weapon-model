const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Маршрут для регистрации пользователя
router.post('/register', userController.registerUser);

// Маршрут для входа пользователя
router.post('/login', userController.loginUser);

// Маршрут для валидации токена
router.post('/validate-token', userController.validateToken);

module.exports = router;