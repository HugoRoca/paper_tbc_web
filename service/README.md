# Servicio Backend - Sistema de Monitoreo de Tuberculosis

Backend API desarrollado con Node.js, Koa, Sequelize (ORM) y Swagger para el sistema de monitoreo de tuberculosis.

## 🏗️ Arquitectura

El proyecto utiliza **Sequelize ORM** para el acceso a datos, lo que proporciona:
- ✅ Type safety y validaciones automáticas
- ✅ Asociaciones entre modelos
- ✅ Migraciones de base de datos
- ✅ Query builder más legible
- ✅ Menos código SQL manual
- ✅ Mejor mantenibilidad

## 📁 Estructura del Proyecto

```
service/
├── src/
│   ├── config/              # Configuraciones
│   │   ├── jwt.js           # Configuración JWT
│   │   ├── swagger.js       # Configuración Swagger/OpenAPI
│   │   └── database.json    # Configuración Sequelize CLI
│   ├── controllers/         # Controladores (lógica de endpoints)
│   ├── middleware/          # Middleware (auth, error handling, rate limiting, validation)
│   ├── models/              # Modelos Sequelize
│   │   ├── index.js         # Configuración Sequelize y asociaciones
│   │   ├── Usuario.js
│   │   ├── CasoIndice.js
│   │   ├── Contacto.js
│   │   └── ... (otros modelos)
│   ├── repositories/        # Acceso a datos con Sequelize
│   ├── routes/              # Definición de rutas
│   ├── services/            # Lógica de negocio
│   └── index.js             # Punto de entrada
├── .sequelizerc             # Configuración Sequelize CLI
├── env.example
├── package.json
└── README.md
```

## 🚀 Instalación

1. Instalar dependencias:
```bash
cd service
npm install
```

2. Configurar variables de entorno:
```bash
cp env.example .env
# Editar .env con tus configuraciones
```

3. Asegúrate de que la base de datos esté creada (ver `../database/README.md`)

4. Iniciar el servidor:
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## ⚙️ Variables de Entorno

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=tbc_monitoring
DB_CONNECTION_LIMIT=10

# JWT
JWT_SECRET=tu-secret-key-muy-segura
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3001

# API URL (para Swagger)
API_URL=http://localhost:3000

# Integraciones (opcional)
SIGTB_ENDPOINT=https://sigtb.example.com/api/consultar
SIGTB_TOKEN=tu_token_sigtb
NETLAB_ENDPOINT=https://netlab.example.com/api/consultar
NETLAB_TOKEN=tu_token_netlab
```

## 📚 Modelos Sequelize

Todos los modelos están definidos en `src/models/` con:
- Definición de campos y tipos
- Validaciones
- Asociaciones entre modelos
- Scopes por defecto (ej: solo activos)

### Ejemplo de uso:

```javascript
const { CasoIndice, Contacto } = require('./models');

// Crear con asociaciones
const caso = await CasoIndice.create({
  codigo_caso: 'CI-2024-001',
  paciente_nombres: 'Juan',
  // ...
});

// Buscar con includes
const casoConContactos = await CasoIndice.findByPk(1, {
  include: [{
    model: Contacto,
    as: 'contactos'
  }]
});
```

## 🔌 Endpoints de la API

### ✅ Estado de Implementación: 100% Completo

**Resumen de Cobertura:**
- **Tablas con endpoints completos**: 17/17 (100%) ✅
- **Tablas con endpoints parciales**: 0/17
- **Tablas sin endpoints**: 0/17

**Nota**: ✅ **TODOS los endpoints están implementados**. Todas las tablas funcionales tienen endpoints completos. Las tablas de logging (`auditoria` e `integraciones_log`) tienen endpoints de consulta para administradores.

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener información del usuario autenticado

### Casos Índice
- `GET /api/casos-indice` - Listar casos índice
- `POST /api/casos-indice` - Crear caso índice
- `GET /api/casos-indice/:id` - Obtener caso índice
- `PUT /api/casos-indice/:id` - Actualizar caso índice
- `DELETE /api/casos-indice/:id` - Eliminar caso índice

### Contactos (RF-01)
- `GET /api/contactos` - Listar contactos
- `POST /api/contactos` - Crear contacto
- `GET /api/contactos/:id` - Obtener contacto
- `GET /api/contactos/caso-indice/:casoIndiceId` - Listar contactos por caso índice
- `PUT /api/contactos/:id` - Actualizar contacto
- `DELETE /api/contactos/:id` - Eliminar contacto

### Exámenes de Contacto (RF-02)
- `GET /api/examenes-contacto` - Listar exámenes
- `POST /api/examenes-contacto` - Crear examen
- `GET /api/examenes-contacto/:id` - Obtener examen
- `GET /api/examenes-contacto/contacto/:contactoId` - Listar exámenes por contacto
- `PUT /api/examenes-contacto/:id` - Actualizar examen
- `DELETE /api/examenes-contacto/:id` - Eliminar examen

### Controles de Contacto (RF-03)
- `GET /api/controles-contacto` - Listar controles
- `POST /api/controles-contacto` - Crear control
- `GET /api/controles-contacto/:id` - Obtener control
- `GET /api/controles-contacto/contacto/:contactoId` - Listar controles por contacto
- `PUT /api/controles-contacto/:id/realizar` - Marcar control como realizado
- `PUT /api/controles-contacto/:id` - Actualizar control
- `DELETE /api/controles-contacto/:id` - Eliminar control

### Esquemas TPT
- `GET /api/esquemas-tpt` - Listar esquemas TPT
- `POST /api/esquemas-tpt` - Crear esquema TPT
- `GET /api/esquemas-tpt/:id` - Obtener esquema TPT
- `PUT /api/esquemas-tpt/:id` - Actualizar esquema TPT
- `DELETE /api/esquemas-tpt/:id` - Eliminar esquema TPT

### TPT Indicaciones (RF-04)
- `GET /api/tpt-indicaciones` - Listar indicaciones TPT
- `POST /api/tpt-indicaciones` - Crear indicación TPT
- `GET /api/tpt-indicaciones/:id` - Obtener indicación TPT
- `GET /api/tpt-indicaciones/contacto/:contactoId` - Listar indicaciones por contacto
- `PUT /api/tpt-indicaciones/:id/iniciar` - Iniciar TPT
- `PUT /api/tpt-indicaciones/:id` - Actualizar indicación TPT
- `DELETE /api/tpt-indicaciones/:id` - Eliminar indicación TPT

### TPT Consentimientos (RF-05)
- `POST /api/tpt-consentimientos` - Crear consentimiento TPT
- `GET /api/tpt-consentimientos/:id` - Obtener consentimiento
- `GET /api/tpt-consentimientos/tpt-indicacion/:tptIndicacionId` - Obtener consentimiento por indicación
- `PUT /api/tpt-consentimientos/:id` - Actualizar consentimiento
- `DELETE /api/tpt-consentimientos/:id` - Eliminar consentimiento

### TPT Seguimiento (RF-04)
- `GET /api/tpt-seguimiento` - Listar seguimientos TPT
- `POST /api/tpt-seguimiento` - Crear seguimiento TPT
- `GET /api/tpt-seguimiento/:id` - Obtener seguimiento TPT
- `GET /api/tpt-seguimiento/tpt-indicacion/:tptIndicacionId` - Listar seguimientos por indicación
- `PUT /api/tpt-seguimiento/:id` - Actualizar seguimiento TPT
- `DELETE /api/tpt-seguimiento/:id` - Eliminar seguimiento TPT

### Reacciones Adversas (RF-06)
- `GET /api/reacciones-adversas` - Listar reacciones adversas
- `POST /api/reacciones-adversas` - Crear reacción adversa
- `GET /api/reacciones-adversas/:id` - Obtener reacción adversa
- `GET /api/reacciones-adversas/tpt-indicacion/:tptIndicacionId` - Listar reacciones por indicación TPT
- `PUT /api/reacciones-adversas/:id` - Actualizar reacción adversa
- `DELETE /api/reacciones-adversas/:id` - Eliminar reacción adversa

### Visitas Domiciliarias (RF-08)
- `GET /api/visitas-domiciliarias` - Listar visitas domiciliarias
- `POST /api/visitas-domiciliarias` - Crear visita domiciliaria
- `GET /api/visitas-domiciliarias/:id` - Obtener visita domiciliaria
- `GET /api/visitas-domiciliarias/contacto/:contactoId` - Listar visitas por contacto
- `GET /api/visitas-domiciliarias/caso-indice/:casoIndiceId` - Listar visitas por caso índice
- `PUT /api/visitas-domiciliarias/:id` - Actualizar visita domiciliaria
- `DELETE /api/visitas-domiciliarias/:id` - Eliminar visita domiciliaria

### Derivaciones/Transferencias (RF-09)
- `GET /api/derivaciones-transferencias` - Listar derivaciones/transferencias
- `POST /api/derivaciones-transferencias` - Crear derivación/transferencia
- `GET /api/derivaciones-transferencias/:id` - Obtener derivación/transferencia
- `GET /api/derivaciones-transferencias/contacto/:contactoId` - Listar por contacto
- `GET /api/derivaciones-transferencias/establecimiento/:establecimientoId/pendientes` - Listar pendientes por establecimiento
- `PUT /api/derivaciones-transferencias/:id/aceptar` - Aceptar derivación
- `PUT /api/derivaciones-transferencias/:id/rechazar` - Rechazar derivación
- `PUT /api/derivaciones-transferencias/:id` - Actualizar derivación/transferencia
- `DELETE /api/derivaciones-transferencias/:id` - Eliminar derivación/transferencia

### Alertas (RF-10)
- `GET /api/alertas` - Listar alertas
- `POST /api/alertas` - Crear alerta
- `GET /api/alertas/activas` - Listar alertas activas
- `GET /api/alertas/:id` - Obtener alerta
- `PUT /api/alertas/:id/resolver` - Resolver alerta
- `PUT /api/alertas/:id` - Actualizar alerta
- `DELETE /api/alertas/:id` - Eliminar alerta

### Establecimientos de Salud
- `GET /api/establecimientos-salud` - Listar establecimientos
- `POST /api/establecimientos-salud` - Crear establecimiento
- `GET /api/establecimientos-salud/:id` - Obtener establecimiento
- `PUT /api/establecimientos-salud/:id` - Actualizar establecimiento
- `DELETE /api/establecimientos-salud/:id` - Eliminar establecimiento

### Gestión de Usuarios ✅
- `GET /api/usuarios` - Listar usuarios (con paginación y filtros, requiere Administrador)
- `POST /api/usuarios` - Crear usuario (requiere Administrador)
- `GET /api/usuarios/:id` - Obtener usuario (requiere Administrador)
- `PUT /api/usuarios/:id` - Actualizar usuario (requiere Administrador)
- `PUT /api/usuarios/:id/cambiar-password` - Cambiar contraseña (usuario puede cambiar su propia contraseña)
- `DELETE /api/usuarios/:id` - Eliminar/desactivar usuario (requiere Administrador)

### Gestión de Roles ✅
- `GET /api/roles` - Listar roles (todos los usuarios autenticados)
- `POST /api/roles` - Crear rol (solo Administradores)
- `GET /api/roles/:id` - Obtener rol (todos los usuarios autenticados)
- `PUT /api/roles/:id` - Actualizar rol (solo Administradores)
- `DELETE /api/roles/:id` - Eliminar rol (solo Administradores)

### Auditoría (RNF-03) ✅
- `GET /api/auditoria` - Listar registros de auditoría (solo lectura, requiere Administrador)
- `GET /api/auditoria/:id` - Obtener registro de auditoría (requiere Administrador)
- `GET /api/auditoria/usuario/:usuarioId` - Listar auditoría por usuario (requiere Administrador)
- `GET /api/auditoria/tabla/:tabla` - Listar auditoría por tabla (requiere Administrador)

### Integraciones (RF-07, RNF-02) ✅
- `GET /api/integraciones-log` - Listar logs de integraciones (solo lectura, requiere Administrador)
- `GET /api/integraciones-log/:id` - Obtener log de integración (requiere Administrador)
- `GET /api/integraciones-log/sistema/:sistema` - Listar logs por sistema (SIGTB, NETLAB, Otro, requiere Administrador)
- `POST /api/integraciones/sigtb/consultar` - Consultar SIGTB (requiere Administrador o Médico)
- `POST /api/integraciones/netlab/consultar` - Consultar NETLAB (requiere Administrador o Médico)

## 📖 Documentación API

Documentación Swagger/OpenAPI disponible en:
```
http://localhost:3000/api-docs
```

La documentación incluye:
- Descripción de todos los endpoints
- Parámetros requeridos y opcionales
- Ejemplos de requests y responses
- Esquemas de datos
- Autenticación JWT

## 🔐 Autenticación y Seguridad

### Autenticación JWT
Todos los endpoints (excepto `/api/auth/login`) requieren autenticación mediante JWT.

**Header requerido:**
```
Authorization: Bearer <token>
```

**Ejemplo de login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@salud.gob.pe",
    "password": "password123"
  }'
```

### Autorización por Roles
- **Administrador**: Acceso completo a todos los endpoints
- **Médico**: Acceso a endpoints clínicos y consultas de integraciones
- **Enfermería**: Acceso a endpoints de seguimiento y controles
- **Trabajador Social**: Acceso a visitas domiciliarias y derivaciones

### Seguridad Implementada
- ✅ **Rate Limiting**: 100 requests/minuto por IP (5 intentos/15min para login)
- ✅ **Validación de Datos**: Middleware de validación con Joi
- ✅ **Helmet**: Headers de seguridad HTTP
- ✅ **CORS**: Configuración de origen cruzado
- ✅ **Bcrypt**: Hash de contraseñas (10 rounds)
- ✅ **JWT**: Tokens con expiración configurable

## 🏛️ Arquitectura en Capas

### Models (Sequelize)
Definición de esquemas de base de datos, validaciones y asociaciones.

### Repositories
Capa de acceso a datos usando Sequelize. Contiene métodos para CRUD y consultas complejas.

### Services
Capa de lógica de negocio. Contiene validaciones de negocio y orquestación.

### Controllers
Capa de presentación. Maneja peticiones HTTP y respuestas.

### Middleware
- `auth.js`: Autenticación JWT y autorización por roles
- `errorHandler.js`: Manejo centralizado de errores
- `audit.js`: Registro de auditoría (opcional)
- `rateLimiter.js`: Rate limiting para prevenir abuso
- `validate.js`: Validación de datos con Joi

## 🔄 Migraciones de Base de Datos

El proyecto está configurado para usar Sequelize CLI para migraciones:

```bash
# Crear nueva migración
npx sequelize-cli migration:generate --name nombre-migracion

# Ejecutar migraciones
npx sequelize-cli db:migrate

# Revertir última migración
npx sequelize-cli db:migrate:undo
```

## 📝 Funcionalidades Implementadas

### ✅ Completado
- ✅ Todos los endpoints CRUD para todas las entidades
- ✅ Autenticación JWT con roles
- ✅ Validación de datos con Joi
- ✅ Rate limiting
- ✅ Documentación Swagger completa
- ✅ Logging de auditoría
- ✅ Integraciones con SIGTB y NETLAB (estructura lista)
- ✅ Migraciones de Sequelize configuradas

### 🔄 Mejoras Futuras
- [ ] Implementar tests unitarios e integración
- [ ] Agregar más validaciones Joi en endpoints específicos
- [ ] Implementar caché para consultas frecuentes
- [ ] Agregar monitoreo y logging avanzado
- [ ] Configurar backups automáticos
- [ ] Implementar stored procedures si es necesario

## 💡 Ventajas de Sequelize

1. **Menos código SQL**: Queries más legibles y mantenibles
2. **Type safety**: Validaciones automáticas de tipos
3. **Asociaciones**: Relaciones entre modelos más fáciles
4. **Migraciones**: Control de versiones del esquema
5. **Transacciones**: Soporte nativo para transacciones
6. **Hooks**: Lifecycle hooks para lógica adicional
7. **Scopes**: Consultas reutilizables

## ⚠️ Notas Importantes

- Las contraseñas se hashean con bcrypt (10 rounds)
- Se usa soft delete (campo `activo`) en lugar de eliminar registros físicamente
- La auditoría se registra automáticamente para acciones POST, PUT, DELETE
- Todos los endpoints devuelven respuestas en formato JSON con estructura `{ success, data/message }`
- Sequelize usa `freezeTableName: true` para mantener los nombres de tablas exactos
- El rate limiting excluye los endpoints de Swagger y health check

## 🔗 Referencias

- **Base de Datos**: Ver `../database/README.md` para información sobre el esquema de la base de datos
- **Swagger UI**: `http://localhost:3000/api-docs`
- **Health Check**: `http://localhost:3000/health`
