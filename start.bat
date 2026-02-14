@echo off
chcp 65001 >nul
title Экология Беларуси - Запуск

echo.
echo 🌍 Запуск приложения "Экология Беларуси"...
echo.

REM Проверка наличия Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js не установлен. Пожалуйста, установите Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM Проверка наличия PostgreSQL
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ PostgreSQL не найден в PATH. Убедитесь, что PostgreSQL установлен и запущен.
    echo.
)

echo ✅ Node.js обнаружен
echo.

REM Установка зависимостей backend (если не установлены)
if not exist "backend\node_modules\" (
    echo 📦 Установка зависимостей backend...
    cd backend
    call npm install
    cd ..
    echo ✅ Зависимости backend установлены
    echo.
)

REM Проверка наличия .env файла
if not exist "backend\.env" (
    echo ⚠️ Файл .env не найден. Создаём из .env.example...
    copy backend\.env.example backend\.env
    echo ⚙️ Пожалуйста, отредактируйте backend\.env и укажите свои данные для PostgreSQL
    echo После этого запустите скрипт снова
    pause
    exit /b 1
)

REM Запуск backend сервера
echo 🚀 Запуск backend сервера...
start "Backend Server" cmd /k "cd backend && node server.js"
timeout /t 3 >nul

REM Запуск frontend сервера
echo 🌐 Запуск frontend сервера...

where http-server >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start "Frontend Server" cmd /k "cd frontend && http-server -p 8000 -o"
) else (
    where python >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        start "Frontend Server" cmd /k "cd frontend && python -m http.server 8000"
    ) else (
        echo ⚠️ Не найден веб-сервер для frontend
        echo Установите http-server: npm install -g http-server
        echo Или откройте frontend\index.html в браузере вручную
        pause
        exit /b 1
    )
)

timeout /t 3 >nul

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🎉 Приложение успешно запущено!
echo.
echo 📡 Backend API: http://localhost:3000
echo 🌐 Frontend:    http://localhost:8000
echo.
echo Для остановки закройте окна серверов
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Открытие браузера
timeout /t 2 >nul
start http://localhost:8000

pause
