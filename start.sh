#!/bin/bash

# Script para iniciar Digital Paper (Backend + Frontend)
# Uso: ./start.sh

echo "Iniciando Digital Paper..."
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar si un puerto está en uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "Error: Node.js no está instalado"
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "Error: npm no está instalado"
    exit 1
fi

# Verificar si existe el archivo .env en backend
if [ ! -f "backend/.env" ]; then
    echo "${YELLOW} Advertencia: No se encontró el archivo backend/.env${NC}"
    echo "📝 Creando archivo .env de ejemplo..."
    cat > backend/.env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_DATABASE=digitalpaper
DB_SYNCHRONIZE=true
PORT=3000
NODE_ENV=development
EOF
    echo "${YELLOW} Por favor, edita backend/.env con tus credenciales de PostgreSQL${NC}"
    echo ""
fi

# Verificar si las dependencias están instaladas
if [ ! -d "backend/node_modules" ]; then
    echo "${BLUE}Instalando dependencias del backend...${NC}"
    cd backend
    npm install
    cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "${BLUE}Instalando dependencias del frontend...${NC}"
    cd frontend
    npm install
    cd ..
fi

# Verificar puertos
if check_port 3000; then
    echo "${YELLOW} El puerto 3000 (backend) ya está en uso${NC}"
fi

if check_port 4200; then
    echo "${YELLOW} El puerto 4200 (frontend) ya está en uso${NC}"
fi

echo ""
echo "${GREEN} Iniciando servicios...${NC}"
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "${YELLOW}Deteniendo servicios...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Capturar Ctrl+C
trap cleanup INT TERM

# Iniciar backend en background
echo "${BLUE} Iniciando backend en http://localhost:3000${NC}"
cd backend
npm run start:dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Esperar un poco para que el backend inicie
sleep 3

# Iniciar frontend en background
echo "${BLUE} Iniciando frontend en http://localhost:4200${NC}"
cd frontend
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "${GREEN}Servicios iniciados correctamente!${NC}"
echo ""
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:4200"
echo ""
echo "Logs:"
echo "   - Backend:  tail -f backend.log"
echo "   - Frontend: tail -f frontend.log"
echo ""
echo "Presiona Ctrl+C para detener todos los servicios"
echo ""

# Esperar a que el usuario presione Ctrl+C
wait

