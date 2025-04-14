const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../orm/user_model'); 

const router = express.Router();

router.get('/', async (req, res) => {
    
        //const users = await User.find({}, '-password');
        res.status(200).json('huesos');
    
});

router.post('/users', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Все поля (username, email, password) обязательны' });
        }

        const newUser = new User({
            username,
            email,
            password,
            login_token: 13,
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера при создании пользователя' });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера при получении пользователей' });
    }
});

router.get('/users/:token', async (req, res) => {
    try {
        const user = await User.findOne({ login_token: req.params.login_token }, '-password');
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера при получении пользователя' });
    }
});

router.put('/users/:token', async (req, res) => {
    try {
        const updates = req.body;
        const allowedUpdates = ['username', 'email', 'password'];
        const isValidOperation = Object.keys(updates).every((update) =>
            allowedUpdates.includes(update)
        );

        if (!isValidOperation) {
            return res.status(400).json({ error: 'Недопустимые поля для обновления' });
        }

        const user = await User.findOneAndUpdate(
            { login_token: req.params.login_token },
            updates,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера при обновлении пользователя' });
    }
});

router.delete('/users/:token', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ login_token: req.params.login_token });
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.status(200).json({ message: 'Пользователь успешно удален' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера при удалении пользователя' });
    }
});

module.exports = router;