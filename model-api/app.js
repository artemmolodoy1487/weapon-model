const express = require('express');
const mongoose = require('mongoose');
const User = require('./orm/user_model');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для обработки JSON
app.use(express.json());

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Подключено к MongoDB');
}).catch((err) => {
    console.error('Ошибка подключения к MongoDB:', err);
});

// Маршрут для создания нового пользователя
app.post('/users', async (req, res) => {
    try {
        const { username, email, password, weapons } = req.body;
        const newUser = new User({ username, email, password, weapons });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Маршрут для получения всех пользователей
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Маршрут для получения пользователя по ID
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Маршрут для добавления оружия пользователю
app.post('/users/:id/weapons', async (req, res) => {
    try {
        const { name, type, magazineCapacity, bulletsInMagazine, isSafetyOn } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        user.weapons.push({ name, type, magazineCapacity, bulletsInMagazine, isSafetyOn });
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
