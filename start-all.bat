@echo off
title BlizuPortfolio + Bot
color 0B
echo Iniciando BlizuBot + Web + Tunnel...

start cmd /k "cd ..\blizubot && python -m bot.bot"
timeout /t 5 /nobreak >nul
start cmd /k "python -m http.server 8080"
timeout /t 3 /nobreak >nul
cloudflared tunnel --config config.yml run
pause