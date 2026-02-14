// server.js
// Главный файл сервера для приложения об экологии Беларуси

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Разрешаем кросс-доменные запросы
app.use(bodyParser.json()); // Парсинг JSON в теле запроса
app.use(bodyParser.urlencoded({ extended: true }));

// Подключение роутов
const problemsRouter = require('./routes/problems');
const solutionsRouter = require('./routes/solutions');
const ideasRouter = require('./routes/ideas');

// Использование роутов
app.use('/api/problems', problemsRouter);
app.use('/api/solutions', solutionsRouter);
app.use('/api/ideas', ideasRouter);

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({
    message: 'Добро пожаловать в API экологии Беларуси',
    version: '1.0.0',
    endpoints: {
      problems: '/api/problems',
      solutions: '/api/solutions',
      ideas: '/api/ideas'
    }
  });
});

// Обработка ошибок 404
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Глобальная обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Внутренняя ошибка сервера',
    message: err.message 
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🌍 Сервер запущен на порту ${PORT}`);
  console.log(`📡 API доступен по адресу http://localhost:${PORT}`);
});

module.exports = app;
