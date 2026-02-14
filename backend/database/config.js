// database/config.js
// Конфигурация подключения к PostgreSQL

const { Pool } = require('pg');

// ВАЖНО: Измените password на ваш реальный пароль!
// Если пароля нет - оставьте пустым: password: '',
// Если пароль есть - напишите: password: 'ваш_пароль',
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'belarus_ecology',
  password: 'root',  // ЗАМЕНИТЕ НА ВАШ ПАРОЛЬ ИЛИ ОСТАВЬТЕ ПУСТЫМ
  port: 5432,
});

// Обработка ошибок подключения
pool.on('error', (err, client) => {
  console.error('❌ Неожиданная ошибка клиента базы данных:', err);
  process.exit(-1);
});

// Проверка подключения при запуске
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ ОШИБКА ПОДКЛЮЧЕНИЯ К БАЗЕ ДАННЫХ:');
    console.error('   Проверьте:');
    console.error('   1. PostgreSQL запущен');
    console.error('   2. База данных belarus_ecology существует');
    console.error('   3. Пароль указан правильно в строке password:');
    console.error('');
    console.error('Детали ошибки:', err.message);
  } else {
    console.log('✅ Подключение к PostgreSQL успешно!');
    console.log('   База данных:', 'belarus_ecology');
    console.log('   Время сервера:', res.rows[0].now);
  }
});

module.exports = pool;