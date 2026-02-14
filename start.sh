#!/bin/bash

# Скрипт быстрого запуска приложения "Экология Беларуси"
# Для Linux и macOS

echo "🌍 Запуск приложения 'Экология Беларуси'..."
echo ""

# Проверка наличия Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Пожалуйста, установите Node.js: https://nodejs.org/"
    exit 1
fi

# Проверка наличия PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL не установлен. Пожалуйста, установите PostgreSQL: https://www.postgresql.org/"
    exit 1
fi

echo "✅ Node.js и PostgreSQL обнаружены"
echo ""

# Установка зависимостей backend (если не установлены)
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Установка зависимостей backend..."
    cd backend
    npm install
    cd ..
    echo "✅ Зависимости backend установлены"
    echo ""
fi

# Проверка наличия .env файла
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Файл .env не найден. Создаём из .env.example..."
    cp backend/.env.example backend/.env
    echo "⚙️  Пожалуйста, отредактируйте backend/.env и укажите свои данные для PostgreSQL"
    echo "После этого запустите скрипт снова"
    exit 1
fi

# Запуск backend сервера
echo "🚀 Запуск backend сервера..."
cd backend
node server.js &
BACKEND_PID=$!
cd ..

# Ждём запуска сервера
sleep 2

# Проверка, запустился ли сервер
if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ Backend сервер запущен (PID: $BACKEND_PID)"
else
    echo "❌ Не удалось запустить backend сервер"
    exit 1
fi

echo ""

# Запуск frontend сервера
echo "🌐 Запуск frontend сервера..."
cd frontend

# Проверка доступности http-server
if command -v http-server &> /dev/null; then
    http-server -p 8000 -o &
    FRONTEND_PID=$!
elif command -v python3 &> /dev/null; then
    python3 -m http.server 8000 &
    FRONTEND_PID=$!
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8000 &
    FRONTEND_PID=$!
else
    echo "⚠️  Не найден веб-сервер для frontend"
    echo "Установите http-server: npm install -g http-server"
    echo "Или откройте frontend/index.html в браузере вручную"
    kill $BACKEND_PID
    exit 1
fi

cd ..

sleep 2

echo "✅ Frontend сервер запущен (PID: $FRONTEND_PID)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Приложение успешно запущено!"
echo ""
echo "📡 Backend API: http://localhost:3000"
echo "🌐 Frontend:    http://localhost:8000"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Функция для корректной остановки серверов
cleanup() {
    echo ""
    echo "🛑 Остановка серверов..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Серверы остановлены"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Ожидание
wait
