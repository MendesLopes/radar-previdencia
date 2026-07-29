@echo off
title Radar Previdenciário - Publicar Next.js no GitHub
echo ========================================================
echo   PUBLICADOR AUTOMATICO DO RADAR (NEXT.JS) NO GITHUB
echo ========================================================
echo.
echo Este script enviara a nova versao em Next.js para o seu repositorio.
echo Repositorio atual: https://github.com/MendesLopes/radar-previdencia.git
echo.
set /p confirmar="Deseja prosseguir com o envio? (S/N): "

if /i "%confirmar%" neq "S" (
    echo.
    echo Envio cancelado pelo usuario.
    pause
    exit
)

echo.
echo [1/3] Vinculando ao repositorio remoto...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/MendesLopes/radar-previdencia.git

echo.
echo [2/3] Enviando os arquivos para a branch 'main'...
echo (Sua senha ou login do GitHub podera ser solicitado na janela popup)
echo.
git push -f origin main

if %errorlevel% neq 0 (
    echo.
    echo [ERRO] O envio falhou. Verifique suas credenciais.
    pause
    exit
)

echo.
echo [3/3] Sucesso! Código Next.js enviado para o GitHub.
echo.
echo ========================================================
echo   IMPORTANTE: AJUSTE DO GITHUB PAGES PARA NEXT.JS
echo ========================================================
echo Como o Next.js precisa ser compilado pelo GitHub Actions:
echo.
echo 1. Acesse: https://github.com/MendesLopes/radar-previdencia/settings/pages
echo 2. Sob "Build and deployment -> Source", escolha:
echo    "Deploy from a branch" (caso ja nao esteja).
echo 3. Em "Branch", mude de "main" para "gh-pages" (e mantenha /root).
echo 4. Clique em "Save" (Salvar).
echo.
echo *Nota: A branch 'gh-pages' sera criada automaticamente pela automacao do
echo GitHub assim que ela terminar de rodar pela primeira vez (cerca de 3 min).
echo.
pause
