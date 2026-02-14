# 🌍 Экология Беларуси - Веб-приложение

Полноценное full-stack веб-приложение для изучения экологических проблем Беларуси и поиска решений.

## 🛠️ Технологии

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js + Express
- **Database**: PostgreSQL

## 🚀 Установка и запуск

### Требования:
- Node.js 14+
- PostgreSQL 12+

### Шаги:

1. Клонируйте репозиторий:
```bash
git clone https://github.com/ВАШ_USERNAME/belarus-ecology-app.git
cd belarus-ecology-app
```

2. Создайте базу данных:
```bash
psql -U postgres -c "CREATE DATABASE belarus_ecology;"
psql -U postgres -d belarus_ecology -f backend/database/init_empty.sql
```

3. Настройте backend:
```bash
cd backend
npm install
```

Откройте `backend/database/config.js` и укажите пароль PostgreSQL.

4. Запустите backend:
```bash
node server.js
```

5. Запустите frontend (в новом терминале):
```bash
cd frontend
http-server -p 8000
```

6. Откройте в браузере: