// database/config.js
const { Pool } = require('pg');

// Для Render.com используем DATABASE_URL из переменных окружения
// Для локального запуска используем обычные настройки
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      }
    : {
        user: 'postgres',
        host: 'localhost',
        database: 'belarus_ecology',
        password: '',  // ваш локальный пароль
        port: 5432,
      }
);

pool.on('error', (err, client) => {
  console.error('❌ Ошибка клиента базы данных:', err);
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ ОШИБКА ПОДКЛЮЧЕНИЯ К БД:', err.message);
  } else {
    console.log('✅ Подключение к PostgreSQL успешно!');
    console.log('   Время сервера:', res.rows[0].now);
  }
});

module.exports = pool;