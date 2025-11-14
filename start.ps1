# Script PowerShell para iniciar Digital Paper (Backend + Frontend)
# Uso: .\start.ps1

Write-Host "Iniciando Digital Paper..." -ForegroundColor Green
Write-Host ""

# Verificar si Node.js está instalado
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js no está instalado" -ForegroundColor Red
    exit 1
}

# Verificar si npm está instalado
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "Error: npm no está instalado" -ForegroundColor Red
    exit 1
}

# Verificar si existe el archivo .env en backend
if (-not (Test-Path "backend\.env")) {
    Write-Host "Advertencia: No se encontró el archivo backend\.env" -ForegroundColor Yellow
    Write-Host "Creando archivo .env de ejemplo..." -ForegroundColor Yellow
    @"
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_DATABASE=digitalpaper
DB_SYNCHRONIZE=true
PORT=3000
NODE_ENV=development
"@ | Out-File -FilePath "backend\.env" -Encoding utf8
    Write-Host "Por favor, edita backend\.env con tus credenciales de PostgreSQL" -ForegroundColor Yellow
    Write-Host ""
}

# Verificar si las dependencias están instaladas
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "Instalando dependencias del backend..." -ForegroundColor Cyan
    Set-Location backend
    npm install
    Set-Location ..
}

if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "Instalando dependencias del frontend..." -ForegroundColor Cyan
    Set-Location frontend
    npm install
    Set-Location ..
}

# Verificar puertos
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
$port4200 = Get-NetTCPConnection -LocalPort 4200 -ErrorAction SilentlyContinue

if ($port3000) {
    Write-Host "El puerto 3000 (backend) ya está en uso" -ForegroundColor Yellow
}

if ($port4200) {
    Write-Host "El puerto 4200 (frontend) ya está en uso" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Iniciando servicios..." -ForegroundColor Green
Write-Host ""

# Función para limpiar procesos al salir
function Stop-Services {
    Write-Host ""
    Write-Host "Deteniendo servicios..." -ForegroundColor Yellow
    
    if ($backendProcess) {
        Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    
    if ($frontendProcess) {
        Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    
    exit
}

# Capturar Ctrl+C
[Console]::TreatControlCAsInput = $false
$null = Register-EngineEvent PowerShell.Exiting -Action { Stop-Services }

# Iniciar backend
Write-Host "Iniciando backend en http://localhost:3000" -ForegroundColor Cyan
Set-Location backend
$backendProcess = Start-Process -FilePath "npm" -ArgumentList "run", "start:dev" -PassThru -NoNewWindow -RedirectStandardOutput "..\backend.log" -RedirectStandardError "..\backend-error.log"
Set-Location ..

# Esperar un poco para que el backend inicie
Start-Sleep -Seconds 3

# Iniciar frontend
Write-Host "Iniciando frontend en http://localhost:4200" -ForegroundColor Cyan
Set-Location frontend
$frontendProcess = Start-Process -FilePath "npm" -ArgumentList "start" -PassThru -NoNewWindow -RedirectStandardOutput "..\frontend.log" -RedirectStandardError "..\frontend-error.log"
Set-Location ..

Write-Host ""
Write-Host "Servicios iniciados correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:3000"
Write-Host "Frontend: http://localhost:4200"
Write-Host ""
Write-Host "Logs:"
Write-Host "   - Backend:  Get-Content backend.log -Wait"
Write-Host "   - Frontend: Get-Content frontend.log -Wait"
Write-Host ""
Write-Host "Presiona Ctrl+C para detener todos los servicios"
Write-Host ""

# Mantener el script ejecutándose
try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Verificar si los procesos siguen ejecutándose
        if ($backendProcess -and $backendProcess.HasExited) {
            Write-Host "El backend se ha detenido" -ForegroundColor Yellow
        }
        
        if ($frontendProcess -and $frontendProcess.HasExited) {
            Write-Host "El frontend se ha detenido" -ForegroundColor Yellow
        }
    }
}
catch {
    Stop-Services
}

