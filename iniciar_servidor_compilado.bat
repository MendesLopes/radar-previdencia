@echo off
title Radar Previdenciário - Servidor Rust
echo ========================================================
echo   INICIANDO SERVIDOR COMPILADO EM RUST (OFFLINE)
echo ========================================================
echo.

if not exist bin\server.exe (
    echo [AVISO] O servidor compilado 'bin\server.exe' ainda nao existe localmente.
    echo.
    echo Ele sera gerado automaticamente pelo GitHub Actions assim que voce enviar
    echo o codigo. Apos o envio, execute um "git pull" para baixar os binarios prontos!
    echo.
    pause
    exit
)

echo Servidor iniciando em: http://localhost:8080
echo Pressione CTRL+C nesta janela para encerrar.
echo.

:: Aguarda 2 segundos e abre o navegador
timeout /t 2 /nobreak >nul
start http://localhost:8080

:: Executa o binário do servidor Rust
bin\server.exe
pause
