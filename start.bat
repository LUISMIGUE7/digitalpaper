@echo off
REM Script Batch para iniciar Digital Paper (Backend + Frontend)
REM Uso: start.bat

echo Iniciando Digital Paper...
echo.

REM Verificar si existe el archivo .env en backend
if not exist "backend\.env" (
    echo Advertencia: No se encontró el archivo backend\.env
    echo Creando archivo .env de ejemplo...
    (
        echo DB_HOST=localhost
        echo DB_PORT=5432
        echo DB_USERNAME=postgres
        echo DB_PASSWORD=tu_contraseña
        echo DB_DATABASE=digitalpaper
        echo DB_SYNCHRONIZE=true
        echo PORT=3000
        echo NODE_ENV=development
    ) > backend\.env
    echo Por favor, edita backend\.env con tus credenciales de PostgreSQL
    echo.
)

REM Verificar si las dependencias están instaladas
if not exist "backend\node_modules" (
    echo Instalando dependencias del backend...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo Instalando dependencias del frontend...
    cd frontend
    call npm install
    cd ..
)

echo.
echo Iniciando servicios...
echo.

REM Iniciar backend en nueva ventana
echo Iniciando backend en http://localhost:3000
start "Digital Paper - Backend" cmd /k "cd backend && npm run start:dev"

REM Esperar un poco para que el backend inicie
timeout /t 3 /nobreak >nul

REM Iniciar frontend en nueva ventana
echo Iniciando frontend en http://localhost:4200
start "Digital Paper - Frontend" cmd /k "cd frontend && npm start"

echo.
echo  Servicios iniciados correctamente!
echo.
echo  Backend:  http://localhost:3000
echo  Frontend: http://localhost:4200
echo.
echo Las ventanas se abrirán automáticamente.
echo Cierra las ventanas para detener los servicios.
echo.
pause

