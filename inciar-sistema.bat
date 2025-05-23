@echo off
echo Iniciando backend com PM2...

:: Tenta reiniciar o processo, se não existir, inicia
call pm2 restart gestao-financeira || call pm2 start server.js --name gestao-financeira

timeout /t 3 /nobreak >nul

echo Abrindo frontend no navegador...
start "" "http://localhost:3000/"

pause
