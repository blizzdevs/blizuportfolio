Set objShell = WScript.CreateObject("WScript.Shell")
objShell.Run "cmd /c ""cd /d ""c:\Users\blizz\Desktop\BlizuDev\mi-portafolio"" && python -m http.server 8080"", 0, False
WScript.Sleep 3000
objShell.Run "cmd /c ""cloudflared tunnel --config config.yml run""", 0, False