# ERP Municipal - Setup automatico
# Ejecuta este script una sola vez para instalar todo.
# Haz clic derecho > "Ejecutar con PowerShell"
# O desde terminal: .\instalar_y_ejecutar.ps1

$ErrorActionPreference = "Stop"
$BaseDir = $PSScriptRoot

function Write-Step($msg) {
    Write-Host ""
    Write-Host ">>> $msg" -ForegroundColor Cyan
}

# 1. Comprobar si Node.js ya esta instalado
Write-Step "Comprobando Node.js..."
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCmd) {
    $nodeVersion = & node --version
    Write-Host "    Node.js ya instalado: $nodeVersion" -ForegroundColor Green
} else {
    # 2. Descargar e instalar Node.js LTS
    Write-Step "Node.js no encontrado. Descargando instalador..."
    $NodeVersion  = "20.19.2"
    $InstallerUrl = "https://nodejs.org/dist/v$NodeVersion/node-v$NodeVersion-x64.msi"
    $InstallerPath = "$env:TEMP\node-installer.msi"

    Write-Host "    Descargando desde $InstallerUrl"
    Invoke-WebRequest -Uri $InstallerUrl -OutFile $InstallerPath -UseBasicParsing

    Write-Step "Instalando Node.js $NodeVersion (requiere permisos de administrador)..."
    Start-Process msiexec.exe -ArgumentList "/i `"$InstallerPath`" /quiet /norestart" -Wait -Verb RunAs

    # Recargar PATH para que node sea visible en esta sesion
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" +
                [System.Environment]::GetEnvironmentVariable("PATH", "User")

    $nodeVersion = & node --version
    Write-Host "    Node.js instalado: $nodeVersion" -ForegroundColor Green
}

# 3. Instalar dependencias de Option A
Write-Step "Instalando dependencias de Option A..."
Set-Location "$BaseDir\option-a"
& npm install
Write-Host "    Option A lista." -ForegroundColor Green

# 4. Instalar dependencias de Option B
Write-Step "Instalando dependencias de Option B..."
Set-Location "$BaseDir\option-b"
& npm install
Write-Host "    Option B lista." -ForegroundColor Green

# 5. Preguntar que app lanzar
Set-Location $BaseDir
Write-Host ""
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host "  Instalacion completada." -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "  [A]  Option A - Multi-pantalla   http://localhost:5173"
Write-Host "  [B]  Option B - Calendario       http://localhost:5174"
Write-Host "  [AB] Ambas a la vez"
Write-Host "  [N]  Solo instalar, no lanzar ahora"
Write-Host ""
$choice = Read-Host "Que quieres lanzar? [A/B/AB/N]"

switch ($choice.ToUpper()) {
    "A" {
        Write-Host "Lanzando Option A en http://localhost:5173 ..." -ForegroundColor Cyan
        Set-Location "$BaseDir\option-a"
        & npm run dev
    }
    "B" {
        Write-Host "Lanzando Option B en http://localhost:5174 ..." -ForegroundColor Cyan
        Set-Location "$BaseDir\option-b"
        & npm run dev
    }
    "AB" {
        Write-Host "Lanzando ambas apps..." -ForegroundColor Cyan
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$BaseDir\option-a'; npm run dev"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$BaseDir\option-b'; npm run dev"
        Write-Host "  Option A -> http://localhost:5173" -ForegroundColor Green
        Write-Host "  Option B -> http://localhost:5174" -ForegroundColor Green
    }
    default {
        Write-Host "Listo. Para lanzar manualmente:" -ForegroundColor Green
        Write-Host "  cd option-a  y luego  npm run dev   ->  http://localhost:5173"
        Write-Host "  cd option-b  y luego  npm run dev   ->  http://localhost:5174"
    }
}
