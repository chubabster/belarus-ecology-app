// server.js
// Главный файл сервера для приложения об экологии Беларуси

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Функция инициализации базы данных
async function initDatabase() {
  const pool = require('./database/config');
  
  try {
    // Проверяем есть ли таблицы
    const checkTables = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'problems'
      );
    `);
    
    const tablesExist = checkTables.rows[0].exists;
    
    if (!tablesExist) {
      console.log('📦 Таблицы не найдены, инициализируем базу данных...');
      
      // Читаем SQL файл
      const sqlPath = path.join(__dirname, 'database', 'init_empty.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');
      
      // Выполняем SQL
      await pool.query(sql);
      
      console.log('✅ База данных успешно инициализирована!');
    } else {
      console.log('✅ Таблицы уже существуют, пропускаем инициализацию');
    }
  } catch (error) {
    console.error('❌ Ошибка инициализации БД:', error.message);
    // Не останавливаем сервер, продолжаем работу
  }
}

// Инициализация БД при запуске
initDatabase();

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