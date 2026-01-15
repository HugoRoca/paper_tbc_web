# Frontend - Sistema de Monitoreo de Tuberculosis

Frontend desarrollado con React, Vite, Tailwind CSS y React Query para el sistema de monitoreo de tuberculosis.

## 🚀 Tecnologías

- **React 18**: Framework de UI
- **Vite**: Build tool y dev server
- **React Router**: Navegación
- **React Query**: Gestión de estado del servidor y caché
- **Axios**: Cliente HTTP
- **Tailwind CSS**: Estilos
- **Recharts**: Gráficos
- **React Hook Form**: Formularios
- **React Hot Toast**: Notificaciones
- **Lucide React**: Iconos

## 📁 Estructura del Proyecto

```
client/
├── src/
│   ├── components/        # Componentes reutilizables
│   ├── pages/            # Páginas/pantallas
│   ├── services/         # Servicios API
│   ├── hooks/            # Custom hooks
│   ├── context/          # Context API
│   ├── utils/            # Utilidades
│   ├── assets/           # Imágenes, estilos, etc.
│   ├── App.jsx           # Componente principal
│   └── main.jsx          # Punto de entrada
├── public/               # Archivos estáticos
├── package.json
└── vite.config.js
```

## 🚀 Instalación

```bash
cd client
npm install
```

## 🏃 Desarrollo

```bash
npm run dev
```

El servidor de desarrollo se ejecutará en `http://localhost:3001`

## 🏗️ Build

```bash
npm run build
```

## 📝 Variables de Entorno

Crear archivo `.env`:

```env
VITE_API_URL=http://localhost:3000
```

## 🎯 Mapeo de Pantallas y Endpoints

### 1. Autenticación

#### 1.1 Login (`/login`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RNF-01 (Seguridad)  
**Endpoint**: `POST /api/auth/login`

**Campos**:
- Email
- Contraseña
- Recordar sesión (opcional)

**Funcionalidad**: Iniciar sesión con email y contraseña  
**Respuesta**: Token JWT y datos del usuario

#### 1.2 Perfil de Usuario (`/perfil`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: RNF-01  
**Endpoints**:
- `GET /api/auth/me` - Obtener información del usuario autenticado
- `PUT /api/usuarios/:id/cambiar-password` - Cambiar contraseña

**Funcionalidades**:
- Ver información del usuario
- Cambiar contraseña
- Ver rol y permisos

---

### 2. Dashboard Principal (`/dashboard`)

#### 2.1 Vista General
**Prioridad**: 🔴 Alta  
**RF Relacionados**: Todos (vista consolidada)  
**Endpoints a consultar**:
- `GET /api/casos-indice` - Total de casos índice
- `GET /api/contactos` - Total de contactos
- `GET /api/controles-contacto` - Controles pendientes
- `GET /api/tpt-indicaciones` - TPT iniciados
- `GET /api/alertas/activas` - Alertas activas
- `GET /api/derivaciones-transferencias/establecimiento/:id/pendientes` - Derivaciones pendientes

**Componentes/Widgets**:
- **Resumen de Casos Índice**
  - Total de casos activos
  - Casos nuevos este mes
  - Gráfico de tendencia temporal
- **Resumen de Contactos**
  - Total de contactos registrados
  - Contactos pendientes de examen
  - Contactos con TPT indicado
- **Alertas Activas**
  - Lista de alertas críticas (RF-10)
  - Controles pendientes
  - TPT con seguimiento atrasado
- **Derivaciones Pendientes**
  - Derivaciones por aceptar (RF-09)
  - Transferencias en proceso
- **Métricas de TPT**
  - TPT iniciados este mes
  - TPT completados
  - Tasa de adherencia
- **Gráficos**
  - Distribución de contactos por tipo de TB del caso índice
  - Estado de controles programados vs realizados
  - Seguimiento de TPT por esquema

---

### 3. Casos Índice

#### 3.1 Listado de Casos Índice (`/casos-indice`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: Base del sistema  
**Endpoint**: `GET /api/casos-indice`

**Funcionalidades**:
- Tabla con paginación
- Filtros: fecha, establecimiento, estado
- Búsqueda por nombre, DNI, código de caso
- Acciones: Ver, Editar, Eliminar, Ver Contactos

#### 3.2 Detalle de Caso Índice (`/casos-indice/:id`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: Base del sistema  
**Endpoints**:
- `GET /api/casos-indice/:id` - Datos del caso índice
- `GET /api/contactos/caso-indice/:casoIndiceId` - Contactos asociados
- `GET /api/visitas-domiciliarias/caso-indice/:casoIndiceId` - Visitas asociadas

**Secciones**:
- Información del paciente
- Datos clínicos
- Lista de contactos asociados (enlace a módulo de contactos)
- Historial de visitas domiciliarias
- Derivaciones/transferencias relacionadas
- Acciones: Editar, Eliminar

#### 3.3 Crear Caso Índice (`/casos-indice/nuevo`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: Base del sistema  
**Endpoint**: `POST /api/casos-indice`

**Formulario**:
- Datos personales (nombres, apellidos, DNI, fecha nacimiento)
- Datos clínicos (tipo TB, fecha diagnóstico, tratamiento)
- Establecimiento de salud
- Información de contacto

#### 3.4 Editar Caso Índice (`/casos-indice/:id/editar`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: Base del sistema  
**Endpoint**: `PUT /api/casos-indice/:id`

**Funcionalidad**: Formulario para editar caso índice existente

---

### 4. Contactos (RF-01)

#### 4.1 Listado de Contactos (`/contactos`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-01 (Censo de contactos)  
**Endpoints**:
- `GET /api/contactos` - Lista de contactos
- `GET /api/contactos/caso-indice/:casoIndiceId` - Filtrar por caso índice

**Funcionalidades**:
- Tabla con paginación
- Filtros: caso índice, tipo contacto (intra/extra domiciliario), estado
- Búsqueda por nombre, DNI
- Acciones: Ver, Editar, Ver Exámenes, Ver Controles, Ver TPT

#### 4.2 Detalle de Contacto (`/contactos/:id`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-01  
**Endpoints**:
- `GET /api/contactos/:id` - Datos del contacto
- `GET /api/examenes-contacto/contacto/:contactoId` - Exámenes realizados
- `GET /api/controles-contacto/contacto/:contactoId` - Controles realizados
- `GET /api/tpt-indicaciones/contacto/:contactoId` - Indicaciones TPT
- `GET /api/visitas-domiciliarias/contacto/:contactoId` - Visitas domiciliarias
- `GET /api/derivaciones-transferencias/contacto/:contactoId` - Derivaciones/transferencias

**Secciones**:
- Información del contacto
- Relación con caso índice
- Historial de exámenes (RF-02)
- Controles programados y realizados (RF-03)
- Indicaciones de TPT (RF-04)
- Visitas domiciliarias (RF-08)
- Derivaciones/transferencias (RF-09)
- Acciones: Editar, Eliminar

#### 4.3 Crear Contacto (`/contactos/nuevo`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-01  
**Endpoint**: `POST /api/contactos`

**Formulario**:
- Datos personales
- Relación con caso índice (selector)
- Tipo de contacto (intradomiciliario/extradomiciliario)
- Datos de contacto (dirección, teléfono)

#### 4.4 Editar Contacto (`/contactos/:id/editar`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-01  
**Endpoint**: `PUT /api/contactos/:id`

**Funcionalidad**: Formulario para editar contacto existente

---

### 5. Exámenes de Contacto (RF-02)

#### 5.1 Listado de Exámenes (`/examenes-contacto`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-02 (Examen integral)  
**Endpoints**:
- `GET /api/examenes-contacto` - Lista de exámenes
- `GET /api/examenes-contacto/contacto/:contactoId` - Filtrar por contacto

**Funcionalidades**:
- Tabla con paginación
- Filtros: contacto, tipo de examen, fecha
- Acciones: Ver, Editar, Eliminar

#### 5.2 Detalle de Examen (`/examenes-contacto/:id`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-02  
**Endpoint**: `GET /api/examenes-contacto/:id`

**Secciones**:
- Información del examen
- Resultados clínicos
- Resultados radiológicos
- Resultados inmunológicos
- Resultados bacteriológicos

#### 5.3 Crear/Editar Examen (`/examenes-contacto/nuevo`, `/examenes-contacto/:id/editar`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-02  
**Endpoints**:
- `POST /api/examenes-contacto` - Crear examen
- `PUT /api/examenes-contacto/:id` - Actualizar examen

**Formulario**:
- Contacto asociado (selector)
- Fecha del examen
- Examen clínico (síntomas, signos)
- Examen radiológico (tipo, resultado)
- Examen inmunológico (IGRA, PPD, resultado)
- Examen bacteriológico (tipo, resultado)

---

### 6. Controles de Contacto (RF-03)

#### 6.1 Listado de Controles (`/controles-contacto`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-03 (Control de contactos)  
**Endpoints**:
- `GET /api/controles-contacto` - Lista de controles
- `GET /api/controles-contacto/contacto/:contactoId` - Filtrar por contacto

**Funcionalidades**:
- Tabla con paginación
- Filtros: contacto, estado (pendiente/realizado), fecha programada
- Indicadores visuales de controles vencidos
- Acciones: Ver, Marcar como Realizado, Editar, Eliminar

#### 6.2 Detalle de Control (`/controles-contacto/:id`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: RF-03  
**Endpoint**: `GET /api/controles-contacto/:id`

**Secciones**:
- Información del control
- Contacto asociado
- Fecha programada vs realizada
- Observaciones

#### 6.3 Crear/Editar Control (`/controles-contacto/nuevo`, `/controles-contacto/:id/editar`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-03  
**Endpoints**:
- `POST /api/controles-contacto` - Crear control
- `PUT /api/controles-contacto/:id` - Actualizar control

**Formulario**:
- Contacto asociado (selector)
- Fecha programada
- Tipo de control (según tipo TB del caso índice)
- Observaciones

#### 6.4 Marcar Control como Realizado (`/controles-contacto/:id/realizar`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-03  
**Endpoint**: `PUT /api/controles-contacto/:id/realizar`

**Formulario**:
- Fecha de realización
- Observaciones
- Resultado del control

---

### 7. Esquemas TPT

#### 7.1 Listado de Esquemas TPT (`/esquemas-tpt`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: RF-04  
**Endpoint**: `GET /api/esquemas-tpt`

**Funcionalidades**:
- Tabla con esquemas disponibles
- Acciones: Ver, Editar, Eliminar (solo Administrador)

#### 7.2 Crear/Editar Esquema TPT (`/esquemas-tpt/nuevo`, `/esquemas-tpt/:id/editar`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: RF-04  
**Endpoints**:
- `POST /api/esquemas-tpt` - Crear esquema
- `PUT /api/esquemas-tpt/:id` - Actualizar esquema

**Formulario**:
- Nombre del esquema
- Duración (días)
- Medicamentos y dosis
- Descripción

---

### 8. TPT Indicaciones (RF-04)

#### 8.1 Listado de Indicaciones TPT (`/tpt-indicaciones`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-04  
**Endpoints**:
- `GET /api/tpt-indicaciones` - Lista de indicaciones
- `GET /api/tpt-indicaciones/contacto/:contactoId` - Filtrar por contacto

**Funcionalidades**:
- Tabla con paginación
- Filtros: contacto, estado (indicado/iniciado/completado)
- Acciones: Ver, Iniciar TPT, Editar, Eliminar

#### 8.2 Detalle de Indicación TPT (`/tpt-indicaciones/:id`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-04  
**Endpoints**:
- `GET /api/tpt-indicaciones/:id` - Datos de la indicación
- `GET /api/tpt-consentimientos/tpt-indicacion/:tptIndicacionId` - Consentimiento asociado
- `GET /api/tpt-seguimiento/tpt-indicacion/:tptIndicacionId` - Seguimientos realizados
- `GET /api/reacciones-adversas/tpt-indicacion/:tptIndicacionId` - Reacciones adversas

**Secciones**:
- Información de la indicación
- Contacto asociado
- Esquema TPT seleccionado
- Consentimiento informado (RF-05)
- Seguimiento de TPT (RF-04)
- Reacciones adversas (RF-06)
- Acción: Iniciar TPT

#### 8.3 Crear/Editar Indicación TPT (`/tpt-indicaciones/nuevo`, `/tpt-indicaciones/:id/editar`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-04  
**Endpoints**:
- `POST /api/tpt-indicaciones` - Crear indicación
- `PUT /api/tpt-indicaciones/:id` - Actualizar indicación

**Formulario**:
- Contacto asociado (selector)
- Esquema TPT (selector)
- Fecha de indicación
- Motivo de indicación
- Observaciones

#### 8.4 Iniciar TPT (`/tpt-indicaciones/:id/iniciar`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-04  
**Endpoint**: `PUT /api/tpt-indicaciones/:id/iniciar`

**Formulario**:
- Fecha de inicio
- Confirmar consentimiento informado
- Observaciones

---

### 9. TPT Consentimientos (RF-05)

#### 9.1 Crear Consentimiento (`/tpt-consentimientos/nuevo`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-05 (Anexo N°9)  
**Endpoint**: `POST /api/tpt-consentimientos`

**Formulario**:
- Indicación TPT asociada
- Fecha de consentimiento
- Consentimiento del paciente (checkbox)
- Firma del paciente (captura o upload)
- Firma del profesional (captura o upload)
- Observaciones

#### 9.2 Ver/Editar Consentimiento (`/tpt-consentimientos/:id`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-05  
**Endpoints**:
- `GET /api/tpt-consentimientos/:id` - Ver consentimiento
- `PUT /api/tpt-consentimientos/:id` - Actualizar consentimiento

**Funcionalidad**: Visualizar y editar consentimiento

---

### 10. TPT Seguimiento (RF-04)

#### 10.1 Listado de Seguimientos (`/tpt-seguimiento`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-04  
**Endpoints**:
- `GET /api/tpt-seguimiento` - Lista de seguimientos
- `GET /api/tpt-seguimiento/tpt-indicacion/:tptIndicacionId` - Filtrar por indicación

**Funcionalidades**:
- Tabla con paginación
- Filtros: indicación TPT, fecha
- Acciones: Ver, Editar, Eliminar

#### 10.2 Crear/Editar Seguimiento (`/tpt-seguimiento/nuevo`, `/tpt-seguimiento/:id/editar`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-04  
**Endpoints**:
- `POST /api/tpt-seguimiento` - Crear seguimiento
- `PUT /api/tpt-seguimiento/:id` - Actualizar seguimiento

**Formulario**:
- Indicación TPT asociada (selector)
- Fecha de seguimiento
- Dosis administrada
- Adherencia (sí/no)
- Observaciones
- Próxima fecha de seguimiento

---

### 11. Reacciones Adversas (RF-06)

#### 11.1 Listado de Reacciones Adversas (`/reacciones-adversas`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-06 (Anexo N°13)  
**Endpoints**:
- `GET /api/reacciones-adversas` - Lista de reacciones
- `GET /api/reacciones-adversas/tpt-indicacion/:tptIndicacionId` - Filtrar por indicación TPT

**Funcionalidades**:
- Tabla con paginación
- Filtros: indicación TPT, severidad, fecha
- Indicadores visuales de reacciones graves
- Acciones: Ver, Editar, Eliminar

#### 11.2 Detalle de Reacción Adversa (`/reacciones-adversas/:id`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-06  
**Endpoint**: `GET /api/reacciones-adversas/:id`

**Secciones**:
- Información de la reacción
- Indicación TPT asociada
- Tipo de reacción
- Severidad
- Fecha de inicio
- Fecha de resolución
- Tratamiento aplicado
- Observaciones

#### 11.3 Crear/Editar Reacción Adversa (`/reacciones-adversas/nuevo`, `/reacciones-adversas/:id/editar`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-06  
**Endpoints**:
- `POST /api/reacciones-adversas` - Crear reacción
- `PUT /api/reacciones-adversas/:id` - Actualizar reacción

**Formulario**:
- Indicación TPT asociada (selector)
- Tipo de reacción
- Severidad (leve/moderada/grave)
- Fecha de inicio
- Síntomas
- Tratamiento aplicado
- Fecha de resolución (si aplica)
- Observaciones

---

### 12. Visitas Domiciliarias (RF-08)

#### 12.1 Listado de Visitas (`/visitas-domiciliarias`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-08 (Anexo N°15)  
**Endpoints**:
- `GET /api/visitas-domiciliarias` - Lista de visitas
- `GET /api/visitas-domiciliarias/contacto/:contactoId` - Filtrar por contacto
- `GET /api/visitas-domiciliarias/caso-indice/:casoIndiceId` - Filtrar por caso índice

**Funcionalidades**:
- Tabla con paginación
- Filtros: contacto, caso índice, tipo (primer contacto/seguimiento), fecha
- Acciones: Ver, Editar, Eliminar

#### 12.2 Detalle de Visita Domiciliaria (`/visitas-domiciliarias/:id`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: RF-08  
**Endpoint**: `GET /api/visitas-domiciliarias/:id`

**Secciones**:
- Información de la visita
- Contacto o caso índice asociado
- Tipo de visita
- Fecha y hora
- Dirección
- Observaciones
- Resultado de la visita

#### 12.3 Crear/Editar Visita Domiciliaria (`/visitas-domiciliarias/nuevo`, `/visitas-domiciliarias/:id/editar`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-08  
**Endpoints**:
- `POST /api/visitas-domiciliarias` - Crear visita
- `PUT /api/visitas-domiciliarias/:id` - Actualizar visita

**Formulario**:
- Contacto o caso índice asociado (selector)
- Tipo de visita (primer contacto/seguimiento)
- Fecha y hora programada
- Dirección
- Profesional responsable
- Observaciones
- Resultado de la visita

---

### 13. Derivaciones/Transferencias (RF-09)

#### 13.1 Listado de Derivaciones (`/derivaciones-transferencias`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-09 (Flujos de referencia)  
**Endpoints**:
- `GET /api/derivaciones-transferencias` - Lista de derivaciones
- `GET /api/derivaciones-transferencias/contacto/:contactoId` - Filtrar por contacto
- `GET /api/derivaciones-transferencias/establecimiento/:establecimientoId/pendientes` - Pendientes por establecimiento

**Funcionalidades**:
- Tabla con paginación
- Filtros: contacto, establecimiento origen/destino, estado (pendiente/aceptada/rechazada), tipo (derivación/transferencia)
- Indicadores visuales de derivaciones pendientes
- Acciones: Ver, Aceptar, Rechazar, Editar, Eliminar

#### 13.2 Detalle de Derivación/Transferencia (`/derivaciones-transferencias/:id`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: RF-09  
**Endpoint**: `GET /api/derivaciones-transferencias/:id`

**Secciones**:
- Información de la derivación/transferencia
- Contacto asociado
- Establecimiento origen
- Establecimiento destino
- Estado
- Fecha de solicitud
- Fecha de aceptación/rechazo
- Motivo
- Observaciones

#### 13.3 Crear Derivación/Transferencia (`/derivaciones-transferencias/nuevo`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-09  
**Endpoint**: `POST /api/derivaciones-transferencias`

**Formulario**:
- Tipo (derivación/transferencia)
- Contacto asociado (selector)
- Establecimiento origen (automático según usuario)
- Establecimiento destino (selector)
- Motivo
- Observaciones
- Urgencia

#### 13.4 Aceptar/Rechazar Derivación (`/derivaciones-transferencias/:id/aceptar`, `/derivaciones-transferencias/:id/rechazar`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-09  
**Endpoints**:
- `PUT /api/derivaciones-transferencias/:id/aceptar` - Aceptar derivación
- `PUT /api/derivaciones-transferencias/:id/rechazar` - Rechazar derivación

**Formulario**:
- Confirmación de aceptación/rechazo
- Fecha de respuesta
- Observaciones (especialmente para rechazo)

---

### 14. Alertas (RF-10)

#### 14.1 Listado de Alertas (`/alertas`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-10 (Prevención de pérdida de seguimiento)  
**Endpoints**:
- `GET /api/alertas` - Lista de todas las alertas
- `GET /api/alertas/activas` - Solo alertas activas

**Funcionalidades**:
- Tabla con paginación
- Filtros: tipo, severidad, estado (activa/resuelta), fecha
- Indicadores visuales de alertas críticas
- Acciones: Ver, Resolver, Editar, Eliminar

#### 14.2 Detalle de Alerta (`/alertas/:id`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: RF-10  
**Endpoint**: `GET /api/alertas/:id`

**Secciones**:
- Información de la alerta
- Tipo de alerta
- Severidad
- Contacto o caso índice asociado
- Fecha de generación
- Estado (activa/resuelta)
- Descripción
- Acciones tomadas

#### 14.3 Crear Alerta (`/alertas/nuevo`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: RF-10  
**Endpoint**: `POST /api/alertas`

**Formulario**:
- Tipo de alerta
- Severidad
- Contacto o caso índice asociado (selector)
- Descripción
- Fecha de vencimiento (si aplica)

#### 14.4 Resolver Alerta (`/alertas/:id/resolver`)
**Prioridad**: 🔴 Alta  
**RF Relacionados**: RF-10  
**Endpoint**: `PUT /api/alertas/:id/resolver`

**Formulario**:
- Fecha de resolución
- Acciones tomadas
- Observaciones

---

### 15. Establecimientos de Salud

#### 15.1 Listado de Establecimientos (`/establecimientos-salud`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: Gestión del sistema  
**Endpoint**: `GET /api/establecimientos-salud`

**Funcionalidades**:
- Tabla con paginación
- Filtros: nombre, tipo, región
- Búsqueda
- Acciones: Ver, Editar, Eliminar (solo Administrador)

#### 15.2 Crear/Editar Establecimiento (`/establecimientos-salud/nuevo`, `/establecimientos-salud/:id/editar`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: Gestión del sistema  
**Endpoints**:
- `POST /api/establecimientos-salud` - Crear establecimiento
- `PUT /api/establecimientos-salud/:id` - Actualizar establecimiento

**Formulario**:
- Nombre
- Código
- Tipo
- Dirección
- Región
- Teléfono
- Email

---

### 16. Gestión de Usuarios (Solo Administradores)

#### 16.1 Listado de Usuarios (`/usuarios`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: RNF-01 (Solo Administrador)  
**Endpoint**: `GET /api/usuarios`

**Funcionalidades**:
- Tabla con paginación
- Filtros: rol, establecimiento, estado (activo/inactivo)
- Búsqueda por nombre, email
- Acciones: Ver, Editar, Eliminar/Desactivar

#### 16.2 Detalle de Usuario (`/usuarios/:id`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: RNF-01 (Solo Administrador)  
**Endpoint**: `GET /api/usuarios/:id`

**Funcionalidad**: Información completa del usuario

#### 16.3 Crear/Editar Usuario (`/usuarios/nuevo`, `/usuarios/:id/editar`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: RNF-01 (Solo Administrador)  
**Endpoints**:
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `PUT /api/usuarios/:id/cambiar-password` - Cambiar contraseña (admin)

**Formulario**:
- Nombres
- Apellidos
- Email
- Contraseña (solo en creación)
- Rol (selector)
- Establecimiento de salud (selector)
- Estado (activo/inactivo)

---

### 17. Gestión de Roles (Solo Administradores)

#### 17.1 Listado de Roles (`/roles`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: RNF-01 (Solo Administrador)  
**Endpoint**: `GET /api/roles`

**Funcionalidades**:
- Tabla con paginación
- Búsqueda
- Acciones: Ver, Editar, Eliminar (solo Administrador)

#### 17.2 Crear/Editar Rol (`/roles/nuevo`, `/roles/:id/editar`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: RNF-01 (Solo Administrador)  
**Endpoints**:
- `POST /api/roles` - Crear rol
- `PUT /api/roles/:id` - Actualizar rol

**Formulario**:
- Nombre del rol
- Descripción
- Permisos (checkboxes o selector múltiple)

---

### 18. Auditoría (Solo Administradores)

#### 18.1 Listado de Registros de Auditoría (`/auditoria`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: RNF-03 (Solo Administrador, solo lectura)  
**Endpoints**:
- `GET /api/auditoria` - Lista de registros de auditoría
- `GET /api/auditoria/usuario/:usuarioId` - Filtrar por usuario
- `GET /api/auditoria/tabla/:tabla` - Filtrar por tabla

**Funcionalidades**:
- Tabla con paginación
- Filtros: usuario, tabla, acción (CREATE/UPDATE/DELETE), fecha
- Búsqueda
- Solo lectura

#### 18.2 Detalle de Registro de Auditoría (`/auditoria/:id`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: RNF-03 (Solo Administrador)  
**Endpoint**: `GET /api/auditoria/:id`

**Secciones**:
- Usuario que realizó la acción
- Tabla afectada
- Acción realizada
- Fecha y hora
- Datos anteriores (si aplica)
- Datos nuevos (si aplica)
- IP del usuario

---

### 19. Integraciones (RF-07, RNF-02)

#### 19.1 Listado de Logs de Integraciones (`/integraciones-log`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: RF-07, RNF-02 (Solo Administrador, solo lectura)  
**Endpoints**:
- `GET /api/integraciones-log` - Lista de logs
- `GET /api/integraciones-log/sistema/:sistema` - Filtrar por sistema (SIGTB, NETLAB)

**Funcionalidades**:
- Tabla con paginación
- Filtros: sistema (SIGTB/NETLAB/Otro), estado (Exitoso/Error/Pendiente), fecha
- Solo lectura

#### 19.2 Detalle de Log de Integración (`/integraciones-log/:id`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: RF-07, RNF-02 (Solo Administrador)  
**Endpoint**: `GET /api/integraciones-log/:id`

**Secciones**:
- Sistema externo
- Tipo de operación
- Endpoint consultado
- Datos enviados
- Estado
- Código de respuesta
- Datos recibidos
- Mensaje de error (si aplica)
- Fecha y hora
- Usuario que realizó la consulta

#### 19.3 Consultar SIGTB (`/integraciones/sigtb`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: RF-07 (Administrador o Médico)  
**Endpoint**: `POST /api/integraciones/sigtb/consultar`

**Formulario**:
- Parámetros de consulta (según especificación de SIGTB)
- Botón de consulta
- Visualización de resultados

#### 19.4 Consultar NETLAB (`/integraciones/netlab`)
**Prioridad**: 🟡 Media  
**RF Relacionados**: RNF-02 (Administrador o Médico)  
**Endpoint**: `POST /api/integraciones/netlab/consultar`

**Formulario**:
- Parámetros de consulta (según especificación de NETLAB)
- Botón de consulta
- Visualización de resultados

---

## 📊 Resumen de Pantallas

| Módulo | Pantallas | Prioridad Alta | Prioridad Media | Endpoints Principales |
|--------|-----------|----------------|-----------------|----------------------|
| **Autenticación** | 2 | 1 | 1 | `/api/auth/*` |
| **Dashboard** | 1 | 1 | 0 | Múltiples (agregados) |
| **Casos Índice** | 4 | 4 | 0 | `/api/casos-indice/*` |
| **Contactos** | 4 | 4 | 0 | `/api/contactos/*` |
| **Exámenes** | 3 | 3 | 0 | `/api/examenes-contacto/*` |
| **Controles** | 4 | 3 | 1 | `/api/controles-contacto/*` |
| **Esquemas TPT** | 2 | 0 | 2 | `/api/esquemas-tpt/*` |
| **TPT Indicaciones** | 4 | 4 | 0 | `/api/tpt-indicaciones/*` |
| **TPT Consentimientos** | 2 | 2 | 0 | `/api/tpt-consentimientos/*` |
| **TPT Seguimiento** | 2 | 2 | 0 | `/api/tpt-seguimiento/*` |
| **Reacciones Adversas** | 3 | 3 | 0 | `/api/reacciones-adversas/*` |
| **Visitas Domiciliarias** | 3 | 2 | 1 | `/api/visitas-domiciliarias/*` |
| **Derivaciones** | 4 | 3 | 1 | `/api/derivaciones-transferencias/*` |
| **Alertas** | 4 | 2 | 2 | `/api/alertas/*` |
| **Establecimientos** | 2 | 0 | 2 | `/api/establecimientos-salud/*` |
| **Usuarios** | 3 | 0 | 3 | `/api/usuarios/*` |
| **Roles** | 2 | 0 | 2 | `/api/roles/*` |
| **Auditoría** | 2 | 0 | 2 | `/api/auditoria/*` |
| **Integraciones** | 4 | 0 | 4 | `/api/integraciones/*` |
| **TOTAL** | **~50 pantallas** | **~35 alta** | **~15 media** | **~80 endpoints** |

### Resumen por Prioridad

**🔴 Alta Prioridad (35 pantallas)**:
- Autenticación (Login)
- Dashboard
- Casos Índice (4 pantallas)
- Contactos (4 pantallas)
- Exámenes (3 pantallas)
- Controles (3 pantallas)
- TPT Indicaciones (4 pantallas)
- TPT Consentimientos (2 pantallas)
- TPT Seguimiento (2 pantallas)
- Reacciones Adversas (3 pantallas)
- Visitas Domiciliarias (2 pantallas)
- Derivaciones (3 pantallas)
- Alertas (2 pantallas)

**🟡 Media Prioridad (15 pantallas)**:
- Autenticación (Perfil)
- Controles (1 pantalla)
- Esquemas TPT (2 pantallas)
- Visitas Domiciliarias (1 pantalla)
- Derivaciones (1 pantalla)
- Alertas (2 pantallas)
- Establecimientos (2 pantallas)
- Usuarios (3 pantallas)
- Roles (2 pantallas)
- Auditoría (2 pantallas)
- Integraciones (4 pantallas)

## 🎯 Estado de Implementación

### ⏳ Pendiente - Inicio desde Cero
- ✅ Estructura base del proyecto creada
- ✅ Configuración de Vite, Tailwind CSS, React Router, React Query
- ⏳ **Todas las pantallas están pendientes de implementación** (~50 pantallas)

### 📋 Orden Sugerido de Implementación

1. **Autenticación** (2 pantallas)
   - Login
   - Perfil de usuario

2. **Dashboard** (1 pantalla)
   - Vista general con métricas

3. **Casos Índice** (4 pantallas)
   - Listado, Detalle, Crear, Editar

4. **Contactos** (4 pantallas)
   - Listado, Detalle, Crear, Editar

5. **Controles y Exámenes** (6 pantallas)
   - Exámenes de contacto
   - Controles de contacto

6. **TPT** (9 pantallas)
   - Indicaciones, Consentimientos, Seguimiento, Reacciones Adversas

7. **Visitas y Derivaciones** (6 pantallas)
   - Visitas domiciliarias
   - Derivaciones/Transferencias

8. **Alertas** (3 pantallas)
   - Gestión de alertas

9. **Administración** (12 pantallas)
   - Usuarios, Roles, Establecimientos, Auditoría, Integraciones

## 🔧 Configuración

1. **Instalar dependencias**:
```bash
npm install
```

2. **Configurar variables de entorno**:
```bash
cp .env.example .env
# Editar .env con la URL del backend
```

3. **Iniciar servidor de desarrollo**:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3001`

**Nota**: Asegúrate de que el backend esté corriendo en `http://localhost:3000`
