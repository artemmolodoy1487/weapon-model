const express = require('express');
const mongoose = require('mongoose');
const User = require('../orm/user_schema');

const router = express.Router();

// Регистрация пользователя
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Все поля (username, email, password) обязательны' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'Пользователь успешно зарегистрирован', token: newUser.token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера при регистрации пользователя' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Оба поля (email, password) обязательны' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Неверный пароль' });
        }

        res.status(200).json({ message: 'Успешный вход', token: user.token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера при входе пользователя' });
    }
});

// Валидация токена
router.post('/validate-token', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Токен обязателен' });
        }

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ error: 'Неверный токен' });
        }

        res.status(200).json({ message: 'Токен действителен', user: { username: user.username, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера при валидации токена' });
    }
});

// Получение всех пользователей
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера при получении пользователей' });
    }
});

module.exports = router;