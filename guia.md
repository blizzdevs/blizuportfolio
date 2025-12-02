# Guía Completa BlizuPortfolio + BlizuBot (Actualizada 2025-12-02)

## 1. Requisitos
- Python 3.10+
- Git
- Cloudflare account (tunnel)
- Discord Developer Portal account

## 2. Configurar BlizuBot
1. `cd blizubot`
2. `pip install -r requirements.txt`
3. Crea `.env`:
```
DISCORD_TOKEN=tu_bot_token
DATABASE_URL=sqlite:///data/bot.db
WEBHOOK_URL=tu_webhook_discord
ADMIN_IDS=1234567890
```
4. Discord Developer Portal:
 - New Application > Bot > Token copy to .env
 - OAuth2 > URL Generator > Scopes: bot, applications.commands
 - Permissions: Administrator (or specific)
 - Copy invite link.

## 3. Invite Bot
[Invite Link Template](https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=8&scope=bot%20applications.commands)

Replace CLIENT_ID with bot ID.

## 4. Run Bot
```
python -m bot.bot
```

## 5. Portfolio Web + Tunnel
1. `cd mi-portafolio`
2. Doble clic `tunnel.bat` (web server + tunnel).
3. Live: https://blizzdev.site

## 6. Run Todo (Batch Integrado)
Crea `start-all.bat`:
```
@echo off
start cmd /k "cd ..\blizubot && python -m bot.bot"
timeout /t 5
cd mi-portafolio
start cmd /k "python -m http.server 8080"
timeout /t 3
cloudflared tunnel --config config.yml run
```

Doble clic → **Bot + Web + Tunnel live**!

## 1. Portfolio Web (https://blizzdev.site)

### Deploy Cloudflare Tunnel (HTTPS gratis, siempre-on)
1. Terminal en `mi-portafolio`:
```
cloudflared tunnel login
cloudflared tunnel create blizu-portfolio
```
2. Copy UUID (e.g. `97516448-a6ff-469a-a4e6-33abaf567a7b`).
3. `config.yml`:
```
tunnel: blizu-portfolio
credentials-file: "C:\Users\blizz\.cloudflared\97516448-a6ff-469a-a4e6-33abaf567a7b.json"
ingress:
  - hostname: blizzdev.site
    service: http://localhost:8080
  - service: http_status:404
```
4. Route DNS:
```
cloudflared tunnel route dns blizu-portfolio blizzdev.site
```
5. Run:
```
python -m http.server 8080  # Terminal 1
cloudflared tunnel --config config.yml run  # Terminal 2
```
**Live**: https://blizzdev.site

### Batch `tunnel.bat`:
```
@echo off
cd /d "c:\Users\blizz\Desktop\BlizuDev\mi-portafolio"
start cmd /k "python -m http.server 8080"
timeout /t 3 /nobreak >nul
cloudflared tunnel --config config.yml run
pause
```

## 2. BlizuBot (Discord Bot)
1. `cd blizubot`
2. `pip install -r requirements.txt`
3. `.env`:
```
DISCORD_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4OTA.MTAxMjM0NTY3ODkwMTIzNDU2Nzg5
DATABASE_URL=sqlite:///data/bot.db
WEBHOOK_URL=https://blizzdev.site/webhook
ADMIN_IDS=1234567890
```
4. Discord Developer Portal:
 - New App > Bot > Token > copy `.env`.
 - OAuth2 > URL Generator > Scopes: `bot applications.commands` > Permissions: Administrator.
 - **Invite**: https://discord.com/api/oauth2/authorize?client_id=TU_CLIENT_ID&permissions=8&scope=bot%20applications.commands

### Run Bot
```
python -m bot.bot
```

## 3. Run Todo (`start-all.bat`)
```
@echo off
start cmd /k "cd ..\blizubot && python -m bot.bot"
timeout /t 5 /nobreak >nul
cd mi-portafolio
start cmd /k "python -m http.server 8080"
timeout /t 3 /nobreak >nul
cloudflared tunnel --config config.yml run
pause
```

## 4. Auto-inicio (Task Scheduler)
1. "Programador de tareas" > Nueva tarea.
2. General: "Ejecutar con privilegios más altos".
3. Trigger: "Al iniciar sesión".
4. Acción: `start-all.bat`.

## Troubleshooting
- **Tunnel DNS error**: Cloudflare Dashboard > DNS > delete A/AAAA/CNAME `blizzdev.site`.
- **Bot offline**: Check `.env` token.
- **Web not live**: `python -m http.server 8080` running?
- **No UUID**: `cloudflared tunnel list`.

¡**Portfolio + Bot live en blizzdev.site**! 🚀