# Servidor HTTP Estático em PowerShell para o Radar Previdenciário (Next.js out)
$port = 8080
$basePath = $PSScriptRoot
if (-not $basePath) { $basePath = Get-Location }

# Se houver a pasta de exportação estática "out", aponta para ela
$outPath = Join-Path $basePath "out"
if (Test-Path $outPath -PathType Container) {
    $basePath = $outPath
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
} catch {
    Write-Error "Não foi possível iniciar o servidor na porta $port. Verifique se ela já está em uso."
    Exit
}

Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "   SERVIDOR LOCAL ATIVO (OFFLINE): http://localhost:$port/  " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "Diretório base: $basePath"
Write-Host "Pressione CTRL+C nesta janela para encerrar o servidor."
Write-Host ""

# Abre o navegador automaticamente no HTTP local
Start-Process "http://localhost:$port/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") { $localPath = "/index.html" }
        
        $filePath = Join-Path $basePath $localPath

        # Suporte para Clean URLs (Next.js /about -> /about.html)
        if (-not (Test-Path $filePath -PathType Leaf) -and [string]::IsNullOrEmpty([System.IO.Path]::GetExtension($filePath))) {
            $htmlPath = $filePath + ".html"
            if (Test-Path $htmlPath -PathType Leaf) {
                $filePath = $htmlPath
            }
        }

        if (Test-Path $filePath -PathType Leaf) {
            # Define o tipo MIME correto para evitar bloqueios no navegador
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mimeType = switch ($extension) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                ".ico"  { "image/x-icon" }
                default { "application/octet-stream" }
            }

            $fileContent = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mimeType
            $response.ContentLength64 = $fileContent.Length
            $response.OutputStream.Write($fileContent, 0, $fileContent.Length)
            $response.StatusCode = 200
            
            Write-Host "[200] $localPath ($mimeType)" -ForegroundColor Gray
        } else {
            $response.StatusCode = 404
            $errorMsg = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Arquivo Não Encontrado</h1><p>O recurso $localPath não existe neste servidor.</p>")
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $errorMsg.Length
            $response.OutputStream.Write($errorMsg, 0, $errorMsg.Length)
            
            Write-Host "[404] $localPath (Não Encontrado)" -ForegroundColor Red
        }
        $response.Close()
    }
} catch {
    # Captura interrupções (como CTRL+C)
} finally {
    $listener.Stop()
    $listener.Close()
}
