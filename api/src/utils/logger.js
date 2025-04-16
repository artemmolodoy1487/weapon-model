const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(), // Логирование в консоль
        new winston.transports.File({ filename: 'app.log' }), // Логирование в файл
    ],
});

module.exports = logger;