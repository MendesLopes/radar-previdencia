@echo off
title Radar Previdenciário - Servidor Local
echo ========================================================
echo   INICIANDO SERVIDOR LOCAL (OFFLINE)
echo ========================================================
echo.

if exist bin\server.exe (
    echo [INFO] Iniciando servidor compilado em Rust...
    echo Servidor iniciando em: http://localhost:8080
    echo.
    timeout /t 2 /nobreak >nul
    start http://localhost:8080
    bin\server.exe
) else (
    echo [INFO] Servidor compilado em Rust ainda nao foi baixado.
    echo [INFO] Usando o servidor local em PowerShell como alternativa...
    echo Servidor iniciando em: http://localhost:8080
    echo.
    timeout /t 2 /nobreak >nul
    powershell -NoProfile -ExecutionPolicy Bypass -File server.ps1
)

pause
