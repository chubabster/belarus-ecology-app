// database/config.js
const { Pool } = require('pg');

// Для Render обязательно используем DATABASE_URL
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ КРИТИЧЕСКАЯ ОШИБКА: DATABASE_URL не установлена!');
  console.error('   Добавьте переменную окружения DATABASE_URL в настройках Render');
  process.exit(1);
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

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