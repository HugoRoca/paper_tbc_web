# Sistema de Monitoreo de Tuberculosis

Sistema web completo para el monitoreo de pacientes con tuberculosis, desarrollado con Node.js (Backend) y React (Frontend).

## 🏗️ Arquitectura

El proyecto está dividido en tres partes principales:

1. **Base de Datos** (`database/`) - MySQL 8.0
2. **Backend** (`service/`) - Node.js con Koa, Sequelize, Swagger
3. **Frontend** (`client/`) - React con Vite, Tailwind CSS, React Query

## 🚀 Inicio Rápido

> **⚠️ Antes de comenzar**: Asegúrate de tener instalados todos los [requisitos del sistema](#-requisitos-del-sistema).

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd paper_tbc_web
```

### 2. Base de Datos con Docker (Recomendado)

La forma más fácil de iniciar la base de datos es usando Docker Compose:

```bash
# Iniciar MySQL
docker-compose up -d

# Ver logs
docker-compose logs -f mysql

# Verificar que está corriendo
docker-compose ps
```

Esto iniciará MySQL y ejecutará automáticamente los scripts SQL para crear las tablas e insertar datos iniciales.

**Configuración**: El archivo `docker-compose.yml` está configurado para usar el puerto 3306 y crear automáticamente la base de datos `tbc_monitoring` con usuario `tbc_user`.

**Alternativa - MySQL Local**: Si prefieres usar MySQL instalado localmente, asegúrate de:
1. Crear la base de datos: `CREATE DATABASE tbc_monitoring;`
2. Ejecutar los scripts SQL manualmente:
   ```bash
   mysql -u root -p tbc_monitoring < database/schema.sql
   mysql -u root -p tbc_monitoring < database/init_data.sql
   ```

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

El frontend estará disponible en `http://localhost:3002` (puerto configurado en `vite.config.js`)

## 📚 Documentación

- **Base de Datos**: Ver [`database/README.md`](database/README.md)
- **Backend**: Ver [`service/README.md`](service/README.md)
- **Frontend**: Ver [`client/README.md`](client/README.md) - Incluye mapeo completo de pantallas
- **Docker Compose**: Ver [`docker-compose.yml`](docker-compose.yml)

### 📖 Guía de Desarrollo

#### Backend
- Estructura: Controllers → Services → Repositories → Models
- Autenticación: JWT con middleware `authenticate` y `authorize`
- Auditoría: Middleware automático para INSERT, UPDATE, DELETE, LOGIN, LOGOUT
- Validación: Joi schemas en middleware `validate`
- Documentación: Swagger disponible en `/api-docs`

#### Frontend
- Estructura: Pages → Components → Services → Utils
- Estado: React Query para caché y sincronización
- Routing: React Router con rutas protegidas
- Estilos: Tailwind CSS con componentes reutilizables
- Formularios: React Hook Form (donde se use)
- Notificaciones: React Hot Toast

#### Componentes Reutilizables
Todos los componentes están en `client/src/components/` y pueden importarse desde `client/src/components/index.js`

## 🔧 Configuración

### Variables de Entorno

#### Backend (`service/.env`)
```env
DB_HOST=mysql
DB_PORT=3306
DB_USER=tbc_user
DB_PASSWORD=tbc_password
DB_NAME=tbc_monitoring
JWT_SECRET=tu-secret-key-muy-segura
PORT=3000
CORS_ORIGIN=http://localhost:3002
NODE_ENV=development
```

**Nota**: Si usas Docker Compose, `DB_HOST` debe ser `mysql` (nombre del servicio). Si usas MySQL local, usa `localhost`.

#### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:3000
```

**Nota**: El frontend corre en el puerto 3002 por defecto (configurado en `vite.config.js`).

## 📋 Requisitos del Sistema

Para ejecutar este sistema, necesitas instalar los siguientes componentes:

### 🔧 Componentes Requeridos

#### 1. Node.js (Requerido)
- **Versión mínima**: 18.0.0 o superior
- **Recomendado**: 18.x LTS o 20.x LTS
- **Descarga**: 
  - **Windows/Mac/Linux**: [https://nodejs.org/](https://nodejs.org/)
  - **LTS (Recomendado)**: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
- **Verificar instalación**: `node --version`
- **Nota**: npm viene incluido con Node.js (verificar con `npm --version`)

#### 2. MySQL (Requerido - Opción 1: Instalación Local)
- **Versión mínima**: MySQL 8.0 o superior
- **Recomendado**: MySQL 8.0.x o MySQL 8.4.x
- **Descarga**:
  - **Windows**: [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
  - **macOS**: [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/) (o usar Homebrew: `brew install mysql`)
  - **Linux**: [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/) (o usar repositorio del sistema)
- **Verificar instalación**: `mysql --version`
- **Puerto por defecto**: 3306

### 📦 Componentes Opcionales (Recomendados)

#### 4. Git (Opcional pero Recomendado)
- **Versión**: Cualquier versión reciente
- **Descarga**: 
  - **Windows/Mac/Linux**: [https://git-scm.com/downloads](https://git-scm.com/downloads)
  - **macOS**: También disponible vía Homebrew (`brew install git`)
- **Verificar instalación**: `git --version`
- **Uso**: Para clonar el repositorio y control de versiones

#### 5. Editor de Código (Opcional)
- **Recomendado**: 
  - **Visual Studio Code**: [https://code.visualstudio.com/](https://code.visualstudio.com/)
  - **WebStorm**: [https://www.jetbrains.com/webstorm/](https://www.jetbrains.com/webstorm/)
  - **Sublime Text**: [https://www.sublimetext.com/](https://www.sublimetext.com/)

### ✅ Verificación de Instalación

Ejecuta los siguientes comandos para verificar que todo está instalado correctamente:

```bash
# Verificar Node.js y npm
node --version    # Debe mostrar v18.x.x o superior
npm --version     # Debe mostrar 9.x.x o superior

# Si instalaste MySQL localmente
mysql --version   # Debe mostrar mysql Ver 8.0.x o superior

# Si instalaste Git
git --version     # Debe mostrar git version 2.x.x o superior
```

### 🎯 Opciones de Instalación

**Opción A: Con Docker (Recomendado para desarrollo)**
- ✅ Más fácil de configurar
- ✅ No requiere instalación manual de MySQL
- ✅ Entorno aislado y reproducible
- ✅ Fácil de limpiar y reiniciar

**Opción B: Instalación Local**
- ✅ Mejor rendimiento
- ✅ Más control sobre la configuración
- ⚠️ Requiere configuración manual de MySQL
- ⚠️ Puede tener conflictos con otras instalaciones

### 📝 Notas Importantes

- **Node.js**: Asegúrate de instalar la versión LTS (Long Term Support) para mayor estabilidad
- **MySQL**: Si usas Docker, no necesitas instalar MySQL localmente
- **Puertos**: Asegúrate de que los puertos 3000 (backend), 3002 (frontend) y 3306 (MySQL) estén disponibles
- **Permisos**: En Linux/Mac, puede ser necesario usar `sudo` para algunas instalaciones

## 🔐 Credenciales por Defecto

Para desarrollo, se incluyen usuarios de prueba en `database/init_data.sql`:

- **Admin**: `juan.perez@salud.gob.pe` / `password123`
- **Usuario**: `maria.garcia@salud.gob.pe` / `password123`

## 🎯 Características Principales

### Backend
- ✅ API RESTful completa
- ✅ Autenticación JWT con roles
- ✅ Auditoría automática de cambios
- ✅ Validación de datos
- ✅ Rate limiting
- ✅ Documentación Swagger
- ✅ Manejo de errores centralizado
- ✅ Endpoints de estadísticas para dashboard

### Frontend
- ✅ Interfaz moderna y responsive
- ✅ Dashboard con gráficos interactivos
- ✅ Sistema de componentes reutilizables
- ✅ Búsqueda y filtros avanzados
- ✅ Paginación en todas las listas
- ✅ Validación de formularios
- ✅ Notificaciones toast
- ✅ Manejo de estados de carga
- ✅ Navegación intuitiva con sidebar
- ✅ Protección de rutas por rol

## 🛠️ Tecnologías Utilizadas

### Backend
- **Framework**: Koa.js
- **ORM**: Sequelize
- **Base de Datos**: MySQL 8.0
- **Autenticación**: JWT (jsonwebtoken)
- **Validación**: Joi
- **Documentación**: Swagger/OpenAPI
- **Seguridad**: bcrypt, helmet, rate limiting

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Estado**: React Query (TanStack Query)
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Gráficos**: Recharts
- **Formularios**: React Hook Form
- **Notificaciones**: React Hot Toast
- **HTTP Client**: Axios

## 📊 Estructura del Proyecto

```
paper_tbc_web/
├── database/           # Scripts SQL y documentación
│   ├── schema.sql      # Esquema de base de datos
│   └── init_data.sql   # Datos iniciales
├── service/            # Backend Node.js
│   ├── src/
│   │   ├── config/     # Configuración (DB, JWT, Swagger)
│   │   ├── controllers/# Controladores de endpoints
│   │   ├── services/   # Lógica de negocio
│   │   ├── repositories/# Acceso a datos
│   │   ├── models/     # Modelos Sequelize
│   │   ├── routes/     # Definición de rutas
│   │   └── middleware/ # Middlewares (auth, audit, etc.)
│   └── package.json
├── client/             # Frontend React
│   ├── src/
│   │   ├── components/ # Componentes reutilizables
│   │   ├── pages/      # Páginas/Views
│   │   ├── services/   # Servicios API
│   │   ├── context/    # Context API (Auth)
│   │   ├── hooks/      # Custom hooks
│   │   └── utils/      # Utilidades
│   └── package.json
└── docker-compose.yml   # Configuración Docker para MySQL

## 🎯 Estado del Proyecto

### ✅ Base de Datos
- **Completo**: 17 tablas implementadas
- Esquema MySQL 8.0 con relaciones y constraints
- Datos iniciales para desarrollo y testing
- Docker Compose configurado

### ✅ Backend (Node.js + Koa)
- **100% Completo**: Todos los endpoints implementados
- Autenticación JWT con roles
- Middleware de auditoría activo
- Swagger/OpenAPI documentación completa
- Endpoints de dashboard con estadísticas agregadas
- Validación con Joi
- Rate limiting configurado
- Manejo de errores centralizado

### ✅ Frontend (React + Vite)
- **100% Completo**: Todas las pantallas implementadas (~50+ pantallas)
- Sistema de diseño moderno y consistente
- Componentes reutilizables
- Dashboard con gráficos interactivos (Recharts)
- Autenticación completa con protección de rutas
- Diseño responsive y accesible

#### Módulos Implementados:

**1. Autenticación y Usuario**
- ✅ Login
- ✅ Perfil de usuario
- ✅ Cambio de contraseña

**2. Dashboard**
- ✅ Dashboard principal con métricas
- ✅ Gráficos estadísticos (barras, líneas, pastel)
- ✅ Alertas activas
- ✅ Derivaciones pendientes
- ✅ Actualización en tiempo real

**3. Casos Índice**
- ✅ Listado con filtros y búsqueda
- ✅ Detalle de caso
- ✅ Crear caso índice
- ✅ Editar caso índice
- ✅ Eliminar caso índice

**4. Contactos**
- ✅ Listado con filtros y búsqueda
- ✅ Detalle de contacto
- ✅ Crear contacto
- ✅ Editar contacto
- ✅ Eliminar contacto

**5. Exámenes de Contacto**
- ✅ Listado con filtros
- ✅ Detalle de examen
- ✅ Crear/Editar examen

**6. Controles de Contacto**
- ✅ Listado con filtros
- ✅ Detalle de control
- ✅ Crear/Editar control

**7. TPT (Tratamiento Preventivo de Tuberculosis)**
- ✅ Indicaciones TPT (Listado, Detalle, Crear, Editar)
- ✅ Seguimiento TPT (Listado, Detalle, Crear, Editar)
- ✅ Reacciones Adversas (Listado, Detalle, Crear, Editar)
- ✅ Consentimientos TPT (Crear, Ver/Editar)
- ✅ Iniciar TPT
- ✅ Esquemas TPT (Listado, Detalle, Crear, Editar) - Admin

**8. Seguimiento**
- ✅ Visitas Domiciliarias (Listado, Detalle, Crear, Editar)
- ✅ Derivaciones/Transferencias (Listado, Detalle, Crear, Editar, Aceptar, Rechazar)

**9. Alertas**
- ✅ Listado de alertas
- ✅ Detalle de alerta
- ✅ Crear alerta
- ✅ Resolver alerta
- ✅ Editar alerta

**10. Administración**
- ✅ Establecimientos de Salud (Listado, Detalle, Crear, Editar)
- ✅ Usuarios (Listado, Detalle, Crear, Editar) - Admin
- ✅ Roles (Listado, Crear, Editar) - Admin
- ✅ Auditoría (Listado, Detalle) - Admin
- ✅ Integraciones Logs (Listado, Detalle) - Admin
- ✅ Consultar SIGTB - Admin
- ✅ Consultar NETLAB - Admin

### 🎨 Componentes Reutilizables

- **Button**: Botones con variantes (primary, secondary, danger, success)
- **Input**: Campos de entrada con validación y errores
- **Select**: Selects con opciones configurables
- **Card**: Contenedores con título y acciones
- **Badge**: Badges con variantes de color
- **Table**: Tablas reutilizables con columnas configurables
- **Loading**: Indicadores de carga
- **EmptyState**: Estados vacíos personalizables
- **SearchableSelect**: Select con búsqueda integrada
- **StatCard**: Tarjetas de estadísticas para dashboard
- **AlertCard**: Tarjetas de alertas mejoradas
- **Layout**: Layout principal con sidebar y header
- **ProtectedRoute**: Protección de rutas con autenticación

### 🎨 Mejoras Visuales

- **Diseño Moderno**: Gradientes, sombras y animaciones suaves
- **Sistema de Colores**: Paleta consistente en todo el sistema
- **Tipografía**: Jerarquía clara con diferentes pesos
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla
- **Animaciones**: Transiciones suaves y efectos hover
- **Gráficos Interactivos**: Dashboard con visualizaciones usando Recharts
- **Componentes Consistentes**: Todos los componentes siguen el mismo diseño

## 🎨 Características de Diseño

### Sistema de Diseño
- **Gradientes**: Uso consistente en botones y elementos destacados
- **Sombras**: Profundidad visual con múltiples niveles
- **Animaciones**: Transiciones suaves (200-300ms)
- **Colores**: Paleta consistente con variantes semánticas
- **Tipografía**: Jerarquía clara con diferentes pesos y tamaños
- **Espaciado**: Padding y margins consistentes usando Tailwind
- **Responsive**: Diseño adaptable a móviles, tablets y desktop

### Componentes Visuales
- **Cards**: Contenedores con bordes redondeados y sombras
- **Badges**: Etiquetas con variantes de color (primary, success, warning, danger)
- **Botones**: Con estados hover, active, disabled y loading
- **Inputs**: Con iconos, validación visual y mensajes de error
- **Tablas**: Con headers destacados, hover effects y acciones mejoradas
- **Gráficos**: Dashboard con visualizaciones interactivas usando Recharts

## 🔍 Funcionalidades Destacadas

### Dashboard
- Métricas en tiempo real
- Gráficos interactivos (barras, líneas, pastel)
- Actualización automática sin caché
- Indicadores visuales de carga
- Botón de refrescar manual

### Búsqueda y Filtros
- Búsqueda local en tiempo real
- Filtros avanzados por múltiples criterios
- Búsqueda en campos relacionados
- Autocompletado deshabilitado para mejor UX

### Formularios
- Validación en tiempo real
- Mensajes de error específicos por campo
- Selects con búsqueda integrada (SearchableSelect)
- Manejo de fechas con utilidades personalizadas
- Estados de carga y deshabilitado

### Auditoría
- Registro automático de todas las operaciones
- Captura de datos anteriores y nuevos
- Información de usuario, IP y user agent
- Redacción de datos sensibles (contraseñas, tokens)

## 🚀 Próximos Pasos (Opcionales)

- [ ] Exportar datos a Excel/PDF
- [ ] Reportes avanzados con filtros personalizados
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)
- [ ] Tests unitarios y de integración
- [ ] CI/CD pipeline

## 📝 Licencia

ISC

## 👥 Contribución

Este proyecto fue desarrollado como sistema completo de monitoreo de tuberculosis. Para contribuir o reportar problemas, por favor crea un issue en el repositorio.

## 📞 Soporte

Para consultas sobre el sistema:
- Revisa la documentación en cada módulo (`database/README.md`, `service/README.md`, `client/README.md`)
- Consulta la documentación Swagger en `/api-docs` cuando el backend esté corriendo
- Revisa los logs del servidor para debugging
