# Digital Paper

Aplicación web moderna para gestión de notas con sistema de autenticación, categorización por tags y diseño responsivo.

## Características

- Sistema de autenticación con sesiones persistentes en base de datos
- Gestión de notas (crear, editar, eliminar, archivar)
- Sistema de tags/categorías para organizar notas
- Filtrado por tags y estado (activo/archivado)
- Diseño moderno y responsivo con paleta de colores suaves
- Interfaz de usuario intuitiva y atractiva
- API REST completa con NestJS
- Frontend con Angular (standalone components)

## Arquitectura

El proyecto está dividido en dos partes principales:


digitalpaper/
├── backend/          # API REST con NestJS + PostgreSQL
└── frontend/         # Aplicación Angular


### Backend (NestJS)

- **Framework**: NestJS 11
- **Base de datos**: PostgreSQL
- **ORM**: TypeORM
- **Autenticación**: Sesiones con tokens en BD
- **Puerto**: 3000 (configurable)

### Frontend (Angular)

- **Framework**: Angular 20
- **Estilo**: CSS puro con diseño moderno
- **Componentes**: Standalone components
- **Puerto**: 4200 (configurable)

## Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## Instalación

### 1. Clonar el repositorio

bash
git clone <url-del-repositorio>
cd digitalpaper


### 2. Configurar el Backend

bash
cd backend
npm install


Crear archivo `.env` en la carpeta `backend/`:

env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_DATABASE=digitalpaper
DB_SYNCHRONIZE=true
PORT=3000
NODE_ENV=development


### 3. Configurar la Base de Datos

Crear la base de datos en PostgreSQL:

sql
CREATE DATABASE digitalpaper;


### 4. Configurar el Frontend

bash
cd ../frontend
npm install


### 5. Iniciar la aplicación

#### Opción A: Script de inicio rápido (Recomendado)

**Windows (PowerShell):**
```powershell
.\start.ps1
```

**Windows (CMD):**
```cmd
start.bat
```

**Linux/Mac/Git Bash:**
```bash
chmod +x start.sh
./start.sh
```

Los scripts automáticamente:
- Verifican que Node.js y npm estén instalados
- Crean el archivo `.env` si no existe
- Instalan dependencias si faltan
- Inician backend y frontend simultáneamente

#### Opción B: Inicio manual

**Backend** (en una terminal):
```bash
cd backend
npm run start:dev
```

**Frontend** (en otra terminal):
```bash
cd frontend
npm start
```

La aplicación estará disponible en:
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

## Uso

1. **Registro/Login**: Al acceder por primera vez, regístrate con un nombre de usuario y contraseña
2. **Crear Notas**: Haz clic en "Nueva Nota" para crear una nueva nota
3. **Agregar Tags**: Puedes agregar categorías separadas por comas al crear/editar notas
4. **Filtrar**: Usa el campo de búsqueda para filtrar notas por tag
5. **Archivar**: Archiva notas que ya no necesites ver frecuentemente
6. **Cerrar Sesión**: Usa el botón "Cerrar Sesión" en el header

## Seguridad

- Las contraseñas se hashean usando bcrypt antes de guardarse
- Las sesiones se validan contra la base de datos
- Tokens de sesión únicos y con expiración (30 días)
- Variables de entorno para credenciales sensibles

## Estructura del Proyecto

### Backend


backend/
├── src/
│   ├── auth/          # Módulo de autenticación
│   ├── notes/         # Módulo de notas
│   ├── tags/          # Módulo de tags
│   ├── app.module.ts  # Módulo principal
│   └── main.ts        # Punto de entrada
├── dist/              # Código compilado
└── package.json


### Frontend


frontend/
├── src/
│   ├── app/
│   │   ├── components/    # Componentes Angular
│   │   ├── services/      # Servicios HTTP
│   │   ├── guards/        # Guards de autenticación
│   │   └── app.component.ts
│   └── styles.css         # Estilos globales
└── package.json


## Desarrollo

### Ejecutar en modo desarrollo

#### Usando scripts de inicio (Recomendado)

**Windows:**
powershell
.\start.ps1
# o
start.bat


**Linux/Mac/Git Bash:**
bash
./start.sh


#### Inicio manual

**Backend**:
bash
cd backend
npm run start:dev


**Frontend**:
bash
cd frontend
npm start



### Compilar para producción

**Backend**:
bash
cd backend
npm run build
npm run start:prod


**Frontend**:
bash
cd frontend
npm run build


## API Endpoints

### Autenticación

- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/validate` - Validar sesión
- `POST /auth/logout` - Cerrar sesión

### Notas

- `GET /notes?archived=false&tag=tagname` - Listar notas (con filtros)
- `GET /notes/:id` - Obtener nota por ID
- `POST /notes` - Crear nueva nota
- `PUT /notes/:id` - Actualizar nota
- `DELETE /notes/:id` - Eliminar nota

### Tags

- `GET /tags` - Listar todos los tags
- `GET /tags/:id` - Obtener tag por ID
- `POST /tags` - Crear nuevo tag
- `PUT /tags/:id` - Actualizar tag
- `DELETE /tags/:id` - Eliminar tag


## Autor

**Luis Miguel López**


