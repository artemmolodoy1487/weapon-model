class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // Помечаем как операционную ошибку

        Error.captureStackTrace(this, this.constructor);
    }
}

// Middleware для обработки ошибок
const errorHandler = (err, req, res, next) => {
    // Логирование ошибки (только для разработки)
    console.error(err);

    // Определяем статус-код и сообщение об ошибке
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Что-то пошло не так на сервере';

    // Отправляем ответ клиенту
    res.status(statusCode).json({
        status: err.status || 'error',
        statusCode,
        message,
    });
};

module.exports = { errorHandler, AppError };