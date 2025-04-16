// Функция для проверки email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Функция для проверки пароля
const isValidPassword = (password) => {
    return password.length >= 6;
};

// Функция для проверки числовых значений
const isValidNumber = (value, min = 0, max = Infinity) => {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
};

// Функция для проверки строковых значений
const isValidString = (value, minLength = 1) => {
    return typeof value === 'string' && value.trim().length >= minLength;
};

// Функция для проверки типа оружия
const isValidWeaponType = (type) => {
    const validTypes = ['pistol', 'rifle', 'shotgun', 'sniper'];
    return validTypes.includes(type);
};

// Общий объект валидации
const validation = {
    isValidEmail,
    isValidPassword,
    isValidNumber,
    isValidString,
    isValidWeaponType,
};

module.exports = validation;