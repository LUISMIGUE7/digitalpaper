# Digital Paper - Backend API

API REST desarrollada con NestJS para la gestión de notas, tags y autenticación de usuarios.

## 🛠️ Tecnologías

- **NestJS 11**: Framework Node.js
- **TypeORM**: ORM para PostgreSQL
- **PostgreSQL**: Base de datos relacional
- **bcryptjs**: Hash de contraseñas
- **crypto**: Generación de tokens

## 📦 Instalación

```bash
npm install
```

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_DATABASE=digitalpaper
DB_SYNCHRONIZE=true

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration (para producción)
FRONTEND_ORIGIN=https://digitalpaper.vercel.app
```

**IMPORTANTE**: En Render, configura `FRONTEND_ORIGIN` sin barra diagonal al final.
Ejemplo: `https://tu-app.vercel.app` (NO `https://tu-app.vercel.app/`)

### Base de Datos

Asegúrate de tener PostgreSQL instalado y ejecutando. Luego crea la base de datos:

```sql
CREATE DATABASE digitalpaper;
```

TypeORM creará automáticamente las tablas al iniciar la aplicación si `DB_SYNCHRONIZE=true`.

## 🚀 Ejecutar

### Desarrollo

```bash
npm run start:dev
```

### Producción

```bash
npm run build
npm run start:prod
```

La API estará disponible en `http://localhost:3000`

## 📚 Estructura del Código

```
src/
├── auth/              # Módulo de autenticación
│   ├── user.entity.ts        # Entidad Usuario
│   ├── session.entity.ts     # Entidad Sesión
│   ├── auth.service.ts       # Lógica de negocio
│   ├── auth.controller.ts    # Endpoints REST
│   └── auth.module.ts        # Módulo de autenticación
├── notes/             # Módulo de notas
│   ├── note.entity.ts
│   ├── note.service.ts
│   ├── note.controller.ts
│   └── note.module.ts
├── tags/              # Módulo de tags
│   ├── tag.entity.ts
│   ├── tag.service.ts
│   ├── tag.controller.ts
│   └── tag.module.ts
├── app.module.ts      # Módulo raíz
└── main.ts            # Punto de entrada
```

## 🔐 Autenticación

El sistema de autenticación utiliza:

- **Sesiones en BD**: Las sesiones se guardan en la tabla `sessions`
- **Tokens únicos**: Generados con crypto.randomBytes
- **Expiración**: Las sesiones expiran después de 30 días
- **Validación**: Cada petición valida el token contra la BD

### Flujo de Autenticación

1. Usuario se registra → Contraseña hasheada con bcrypt
2. Usuario hace login → Se crea sesión en BD y se retorna token
3. Cliente envía token en header `Authorization: Bearer {token}`
4. Servidor valida token contra BD en cada petición protegida

## 📡 Endpoints de la API

### Autenticación (`/auth`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Registrar nuevo usuario |
| POST | `/auth/login` | Iniciar sesión |
| GET | `/auth/validate` | Validar token de sesión |
| POST | `/auth/logout` | Cerrar sesión |

### Notas (`/notes`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/notes` | Listar notas (con filtros: `?archived=false&tag=tagname`) |
| GET | `/notes/:id` | Obtener nota por ID |
| POST | `/notes` | Crear nueva nota |
| PUT | `/notes/:id` | Actualizar nota |
| DELETE | `/notes/:id` | Eliminar nota |

### Tags (`/tags`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/tags` | Listar todos los tags |
| GET | `/tags/:id` | Obtener tag por ID |
| POST | `/tags` | Crear nuevo tag |
| PUT | `/tags/:id` | Actualizar tag |
| DELETE | `/tags/:id` | Eliminar tag |

## 🗄️ Modelo de Datos

### User
- `id`: number (PK)
- `username`: string (unique)
- `password`: string (hasheada)
- `isActive`: boolean
- `createdAt`: Date

### Session
- `id`: number (PK)
- `token`: string (unique)
- `userId`: number (FK → User)
- `expiresAt`: Date
- `isActive`: boolean
- `createdAt`: Date

### Note
- `id`: number (PK)
- `title`: string
- `content`: string
- `archived`: boolean
- `createdAt`: Date
- `updatedAt`: Date
- `tags`: Tag[] (Many-to-Many)

### Tag
- `id`: number (PK)
- `name`: string (unique)
- `notes`: Note[] (Many-to-Many)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Scripts Disponibles

```bash
npm run start          # Iniciar en producción
npm run start:dev      # Iniciar en modo desarrollo (watch)
npm run start:debug    # Iniciar en modo debug
npm run build          # Compilar TypeScript
npm run format         # Formatear código con Prettier
npm run lint           # Linter con ESLint
```

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (salt rounds: 10)
- ✅ Sesiones validadas contra BD
- ✅ Tokens únicos y seguros
- ✅ Variables de entorno para credenciales
- ✅ CORS configurado para el frontend
- ✅ Validación de datos de entrada

## 📄 Licencia

MIT
