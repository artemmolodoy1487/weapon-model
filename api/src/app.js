const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const weaponRoutes = require('./routes/weaponRoutes');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const cors = require('cors');
require('dotenv').config({ path: '.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Подключение к базе данных
connectDB();



// Routes
app.use('/', userRoutes);
app.use('/', weaponRoutes);

// Обработка ошибок
app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
});

// Запуск сервера
app.listen(PORT, () => {
    logger.info(`Сервер запущен на порту ${PORT}`);
});