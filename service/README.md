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
│   │   ├── database.js      # (Legacy - ahora usa Sequelize)
│   │   ├── jwt.js
│   │   └── swagger.js
│   ├── controllers/         # Controladores (lógica de endpoints)
│   ├── middleware/          # Middleware (auth, error handling)
│   ├── models/              # Modelos Sequelize
│   │   ├── index.js         # Configuración Sequelize y asociaciones
│   │   ├── Usuario.js
│   │   ├── CasoIndice.js
│   │   ├── Contacto.js
│   │   └── ... (otros modelos)
│   ├── repositories/        # Acceso a datos con Sequelize
│   │   ├── userRepository.sequelize.js
│   │   ├── casoIndiceRepository.sequelize.js
│   │   └── contactoRepository.sequelize.js
│   ├── routes/              # Definición de rutas
│   ├── services/            # Lógica de negocio
│   └── index.js             # Punto de entrada
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

## 🔌 Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener información del usuario autenticado

### Casos Índice
- `GET /api/casos-indice` - Listar casos índice
- `POST /api/casos-indice` - Crear caso índice
- `GET /api/casos-indice/:id` - Obtener caso índice
- `PUT /api/casos-indice/:id` - Actualizar caso índice
- `DELETE /api/casos-indice/:id` - Eliminar caso índice

### Contactos
- `GET /api/contactos` - Listar contactos
- `POST /api/contactos` - Crear contacto
- `GET /api/contactos/:id` - Obtener contacto
- `GET /api/contactos/caso-indice/:casoIndiceId` - Listar contactos por caso índice
- `PUT /api/contactos/:id` - Actualizar contacto
- `DELETE /api/contactos/:id` - Eliminar contacto

## 📖 Documentación API

Documentación Swagger disponible en:
```
http://localhost:3000/api-docs
```

## 🔐 Autenticación

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

## 🔄 Migración de SQL a Sequelize

Los repositorios originales con SQL directo se mantienen por compatibilidad pero se recomienda usar las versiones `.sequelize.js`:

- ✅ `userRepository.sequelize.js`
- ✅ `casoIndiceRepository.sequelize.js`
- ✅ `contactoRepository.sequelize.js`

## 📝 Próximos Pasos

- [ ] Implementar endpoints para exámenes de contactos
- [ ] Implementar endpoints para controles de contactos
- [ ] Implementar endpoints para TPT (Terapia Preventiva)
- [ ] Implementar endpoints para visitas domiciliarias
- [ ] Implementar endpoints para alertas
- [ ] Implementar endpoints para derivaciones/transferencias
- [ ] Agregar validación de datos con Joi o similar
- [ ] Implementar tests unitarios e integración
- [ ] Agregar rate limiting
- [ ] Crear migraciones Sequelize para versionado de esquema

## 💡 Ventajas de Sequelize

1. **Menos código SQL**: Queries más legibles y mantenibles
2. **Type safety**: Validaciones automáticas de tipos
3. **Asociaciones**: Relaciones entre modelos más fáciles
4. **Migraciones**: Control de versiones del esquema
5. **Transacciones**: Soporte nativo para transacciones
6. **Hooks**: Lifecycle hooks para lógica adicional
7. **Scopes**: Consultas reutilizables

## ⚠️ Notas

- Las contraseñas se hashean con bcrypt (10 rounds)
- Se usa soft delete (campo `activo`) en lugar de eliminar registros físicamente
- La auditoría se registra automáticamente para acciones POST, PUT, DELETE (si la tabla existe)
- Todos los endpoints devuelven respuestas en formato JSON con estructura `{ success, data/message }`
- Sequelize usa `freezeTableName: true` para mantener los nombres de tablas exactos