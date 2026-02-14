// database/config.js
// Конфигурация подключения к PostgreSQL для Render

const { Pool } = require('pg');

console.log('🔧 Инициализация подключения к БД...');
console.log('DATABASE_URL установлена:', !!process.env.DATABASE_URL);

// Конфигурация для Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? {
    rejectUnauthorized: false
  } : false
});

pool.on('error', (err, client) => {
  console.error('❌ Ошибка пула подключений:', err.message);
});

// Тест подключения
(async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Подключение к PostgreSQL успешно!');
    console.log('   Время сервера:', result.rows[0].now);
  } catch (err) {
    console.error('❌ ОШИБКА ПОДКЛЮЧЕНИЯ К БД:', err.message);
    console.error('   Проверьте что DATABASE_URL установлена в Environment Variables');
  }
})();

module.exports = pool;