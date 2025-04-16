const User = require('../models/User');

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Валидация входных данных
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
        console.error('Ошибка регистрации пользователя:', error.message);
        res.status(500).json({ error: 'Ошибка сервера при регистрации пользователя' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Валидация входных данных
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

        // Создание JWT-токена
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Успешный вход',
            token,
        });
    } catch (error) {
        console.error('Ошибка входа пользователя:', error.message);
        res.status(500).json({ error: 'Ошибка сервера при входе пользователя' });
    }
};

exports.validateToken = async (req, res) => {
    try {
        const { token } = req.body;

        // Валидация токена
        if (!token) {
            return res.status(400).json({ error: 'Токен обязателен' });
        }

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ error: 'Неверный токен' });
        }

        res.status(200).json({ message: 'Токен действителен', user: { username: user.username, email: user.email } });
    } catch (error) {
        console.error('Ошибка валидации токена:', error.message);
        res.status(500).json({ error: 'Ошибка сервера при валидации токена' });
    }
};