@echo off
title Radar Previdenciário - Servidor Next.js
echo ========================================================
echo   INICIANDO SERVIDOR DE DESENVOLVIMENTO NEXT.JS
echo ========================================================
echo.

:: Garante que o Node.js recém-instalado está no PATH da sessão
set "PATH=%SystemRoot%\system32;%SystemRoot%;%SystemRoot%\System32\Wbem;C:\Program Files\nodejs;%PATH%"

echo Servidor iniciando em: http://localhost:3000
echo Pressione CTRL+C nesta janela para encerrar.
echo.

:: Aguarda 2 segundos e abre o navegador
timeout /t 2 /nobreak >nul
start http://localhost:3000

:: Executa o Next.js localmente
npm.cmd run dev
pause
