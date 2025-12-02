@echo off
title BlizuPortfolio Tunnel
color 0B
echo ==================================================
echo BlizuPortfolio - Cloudflare Tunnel
echo ==================================================
cd /d "c:\Users\blizz\Desktop\BlizuDev\mi-portafolio"
start cmd /k "python -m http.server 8080"
timeout /t 3 /nobreak >nul
cloudflared tunnel --config config.yml run
pause