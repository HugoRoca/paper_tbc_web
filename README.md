# Sistema de Monitoreo de Tuberculosis

Sistema web completo para el monitoreo de pacientes con tuberculosis, desarrollado con Node.js (Backend) y React (Frontend).

## 🏗️ Arquitectura

El proyecto está dividido en tres partes principales:

1. **Base de Datos** (`database/`) - MySQL 8.0
2. **Backend** (`service/`) - Node.js con Koa, Sequelize, Swagger
3. **Frontend** (`client/`) - React con Vite, Tailwind CSS, React Query

## 🚀 Inicio Rápido

### 1. Base de Datos con Docker

La forma más fácil de iniciar la base de datos es usando Docker Compose:

```bash
# Iniciar MySQL
docker-compose up -d

# Ver logs
docker-compose logs -f mysql
```

Esto iniciará MySQL y ejecutará automáticamente los scripts SQL para crear las tablas e insertar datos iniciales.

**Ver `docker-compose.README.md` para más detalles.**

### 2. Backend

```bash
cd service
npm install
cp env.example .env
# Editar .env con las credenciales de la base de datos
npm run dev
```

El backend estará disponible en `http://localhost:3000`
- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api-docs`

### 3. Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

El frontend estará disponible en `http://localhost:3001`

## 📚 Documentación

- **Base de Datos**: Ver [`database/README.md`](database/README.md)
- **Backend**: Ver [`service/README.md`](service/README.md)
- **Frontend**: Ver [`client/README.md`](client/README.md)
- **Pantallas Frontend**: Ver [`FRONTEND_PANTALLAS.md`](FRONTEND_PANTALLAS.md)
- **Docker Compose**: Ver [`docker-compose.README.md`](docker-compose.README.md)

## 🔧 Configuración

### Variables de Entorno

#### Backend (`service/.env`)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=tbc_user
DB_PASSWORD=tbc_password
DB_NAME=tbc_monitoring
JWT_SECRET=tu-secret-key-muy-segura
PORT=3000
CORS_ORIGIN=http://localhost:3001
```

#### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:3000
```

## 📋 Requisitos

- Node.js 18+
- MySQL 8.0+ (o Docker)
- npm o yarn

## 🎯 Estado del Proyecto

- ✅ Base de datos completa (17 tablas)
- ✅ Backend completo (100% endpoints implementados)
- ✅ Frontend: Dashboard implementado
- ⏳ Frontend: Autenticación (en progreso)
- ⏳ Frontend: Módulos restantes (pendiente)

## 📝 Licencia

ISC
