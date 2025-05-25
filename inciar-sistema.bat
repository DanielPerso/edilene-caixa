@echo off
echo Iniciando backend com PM2...

:: Acessa a pasta onde está o backend
cd gestao-financeira-backend

:: Tenta reiniciar o processo, se não existir, inicia
call pm2 restart gestao-financeira-backend || call pm2 start server.js --name gestao-financeira-backend

timeout /t 3 /nobreak >nul

echo Abrindo frontend no navegador...
start "chrome" "http://localhost:3000/"

pause
