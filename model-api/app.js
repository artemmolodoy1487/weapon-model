const express = require('express');
const mongoose = require('mongoose');
const User = require('./orm/user_schema');
const user_routes = require('./routes/user_routes');
const weapon_routes = require('./routes/weapon_routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/', user_routes);
app.use('/',weapon_routes);

mongoose.connect('mongodb://localhost:27017/weapon_model_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Подключено к MongoDB');
}).catch((err) => {
    console.error('Ошибка подключения к MongoDB:', err);
});


app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
