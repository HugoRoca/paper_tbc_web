# Base de Datos - Sistema de Monitoreo de Tuberculosis

Este directorio contiene el esquema y scripts de inicialización de la base de datos MySQL para el sistema de monitoreo de tuberculosis.

## Estructura de Archivos

- `schema.sql`: Esquema completo de la base de datos con todas las tablas, relaciones e índices
- `init_data.sql`: Datos iniciales y de ejemplo para desarrollo y pruebas
- `README.md`: Esta documentación

## Requisitos

- MySQL 8.0 o superior
- Usuario con permisos para crear bases de datos y tablas

## Instalación

### 1. Crear la base de datos

```bash
mysql -u root -p < database/schema.sql
```

### 2. Cargar datos iniciales (opcional)

```bash
mysql -u root -p tbc_monitoring < database/init_data.sql
```

O desde MySQL:

```sql
SOURCE database/schema.sql;
SOURCE database/init_data.sql;
```

## Estructura de la Base de Datos

### Tablas Principales

#### 1. **Gestión de Usuarios y Seguridad (RNF-01)**
- `roles`: Roles del sistema (Médico, Enfermería, Trabajador Social, etc.)
- `usuarios`: Usuarios del sistema con autenticación
- `establecimientos_salud`: Establecimientos de salud del sistema

#### 2. **Casos Índice**
- `casos_indice`: Pacientes con TB confirmada

#### 3. **Contactos (RF-01)**
- `contactos`: Registro nominal de contactos (intradomiciliarios y extradomiciliarios)

#### 4. **Exámenes (RF-02)**
- `examenes_contacto`: Registro de exámenes integrales (clínico, radiológico, inmunológico, bacteriológico)

#### 5. **Controles (RF-03)**
- `controles_contacto`: Programación y registro de controles según tipo de TB del caso índice

#### 6. **Terapia Preventiva - TPT (RF-04, RF-05)**
- `esquemas_tpt`: Esquemas de tratamiento preventivo disponibles
- `tpt_indicaciones`: Indicaciones de TPT para contactos
- `tpt_consentimientos`: Registro de consentimiento informado (Anexo N°9)
- `tpt_seguimiento`: Seguimiento y registro de administración de TPT

#### 7. **Reacciones Adversas (RF-06)**
- `reacciones_adversas`: Notificación y seguimiento de RAM (Anexo N°13)

#### 8. **Visitas Domiciliarias (RF-08)**
- `visitas_domiciliarias`: Registro de visitas (primer contacto y seguimiento)

#### 9. **Derivaciones y Transferencias (RF-09)**
- `derivaciones_transferencias`: Derivación y transferencia entre establecimientos

#### 10. **Alertas (RF-10)**
- `alertas`: Alertas por incumplimiento de controles o TPT

#### 11. **Auditoría (RNF-03)**
- `auditoria`: Registro de auditoría y trazabilidad de todas las acciones

#### 12. **Integraciones (RF-07, RNF-02)**
- `integraciones_log`: Log de integraciones con SIGTB y NETLAB

## Esquema de Base de Datos

```mermaid
erDiagram
    roles ||--o{ usuarios : "tiene"
    establecimientos_salud ||--o{ usuarios : "pertenece"
    establecimientos_salud ||--o{ casos_indice : "registra"
    establecimientos_salud ||--o{ contactos : "registra"
    establecimientos_salud ||--o{ examenes_contacto : "realiza"
    establecimientos_salud ||--o{ controles_contacto : "programa"
    establecimientos_salud ||--o{ tpt_indicaciones : "indica"
    establecimientos_salud ||--o{ tpt_seguimiento : "realiza"
    establecimientos_salud ||--o{ reacciones_adversas : "registra"
    establecimientos_salud ||--o{ visitas_domiciliarias : "realiza"
    establecimientos_salud ||--o{ derivaciones_transferencias : "origen"
    establecimientos_salud ||--o{ derivaciones_transferencias : "destino"
    
    usuarios ||--o{ casos_indice : "registra"
    usuarios ||--o{ contactos : "registra"
    usuarios ||--o{ examenes_contacto : "registra"
    usuarios ||--o{ controles_contacto : "programa"
    usuarios ||--o{ controles_contacto : "realiza"
    usuarios ||--o{ tpt_indicaciones : "indica"
    usuarios ||--o{ tpt_consentimientos : "registra"
    usuarios ||--o{ tpt_seguimiento : "registra"
    usuarios ||--o{ reacciones_adversas : "registra"
    usuarios ||--o{ visitas_domiciliarias : "realiza"
    usuarios ||--o{ derivaciones_transferencias : "solicita"
    usuarios ||--o{ derivaciones_transferencias : "acepta"
    usuarios ||--o{ alertas : "resuelve"
    usuarios ||--o{ auditoria : "realiza"
    usuarios ||--o{ integraciones_log : "ejecuta"
    
    casos_indice ||--o{ contactos : "tiene"
    casos_indice ||--o{ visitas_domiciliarias : "tiene"
    casos_indice ||--o{ alertas : "genera"
    
    contactos ||--o{ examenes_contacto : "tiene"
    contactos ||--o{ controles_contacto : "tiene"
    contactos ||--o{ tpt_indicaciones : "tiene"
    contactos ||--o{ visitas_domiciliarias : "tiene"
    contactos ||--o{ derivaciones_transferencias : "tiene"
    contactos ||--o{ alertas : "genera"
    
    esquemas_tpt ||--o{ tpt_indicaciones : "define"
    
    tpt_indicaciones ||--|| tpt_consentimientos : "requiere"
    tpt_indicaciones ||--o{ tpt_seguimiento : "tiene"
    tpt_indicaciones ||--o{ reacciones_adversas : "tiene"
    tpt_indicaciones ||--o{ alertas : "genera"
    
    controles_contacto ||--o{ alertas : "genera"
    visitas_domiciliarias ||--o{ alertas : "genera"
    
    roles {
        int id PK
        varchar nombre
        text descripcion
        boolean activo
        timestamp created_at
        timestamp updated_at
    }
    
    usuarios {
        int id PK
        varchar dni
        varchar nombres
        varchar apellidos
        varchar email
        varchar password_hash
        int rol_id FK
        int establecimiento_id FK
        boolean activo
        timestamp ultimo_acceso
        timestamp created_at
        timestamp updated_at
    }
    
    establecimientos_salud {
        int id PK
        varchar codigo
        varchar nombre
        varchar tipo
        text direccion
        varchar distrito
        varchar provincia
        varchar departamento
        boolean activo
        timestamp created_at
        timestamp updated_at
    }
    
    casos_indice {
        int id PK
        varchar codigo_caso
        varchar paciente_dni
        varchar paciente_nombres
        varchar paciente_apellidos
        date fecha_nacimiento
        enum sexo
        enum tipo_tb
        date fecha_diagnostico
        int establecimiento_id FK
        int usuario_registro_id FK
        boolean activo
        text observaciones
        timestamp created_at
        timestamp updated_at
    }
    
    contactos {
        int id PK
        int caso_indice_id FK
        varchar dni
        varchar nombres
        varchar apellidos
        date fecha_nacimiento
        enum sexo
        enum tipo_contacto
        varchar parentesco
        text direccion
        varchar telefono
        int establecimiento_id FK
        int usuario_registro_id FK
        date fecha_registro
        boolean activo
        text observaciones
        timestamp created_at
        timestamp updated_at
    }
    
    examenes_contacto {
        int id PK
        int contacto_id FK
        date fecha_examen
        enum tipo_examen
        text resultado
        varchar resultado_codificado
        int establecimiento_id FK
        int usuario_registro_id FK
        text observaciones
        timestamp created_at
        timestamp updated_at
    }
    
    controles_contacto {
        int id PK
        int contacto_id FK
        int numero_control
        date fecha_programada
        date fecha_realizada
        enum tipo_control
        text resultado
        enum estado
        int establecimiento_id FK
        int usuario_programa_id FK
        int usuario_realiza_id FK
        text observaciones
        timestamp created_at
        timestamp updated_at
    }
    
    esquemas_tpt {
        int id PK
        varchar codigo
        varchar nombre
        text descripcion
        int duracion_meses
        text medicamentos
        boolean activo
        timestamp created_at
        timestamp updated_at
    }
    
    tpt_indicaciones {
        int id PK
        int contacto_id FK
        int esquema_tpt_id FK
        date fecha_indicacion
        date fecha_inicio
        date fecha_fin_prevista
        enum estado
        text motivo_indicacion
        int establecimiento_id FK
        int usuario_indicacion_id FK
        text observaciones
        timestamp created_at
        timestamp updated_at
    }
    
    tpt_consentimientos {
        int id PK
        int tpt_indicacion_id FK
        date fecha_consentimiento
        boolean consentimiento_firmado
        varchar ruta_archivo_consentimiento
        int usuario_registro_id FK
        text observaciones
        timestamp created_at
        timestamp updated_at
    }
    
    tpt_seguimiento {
        int id PK
        int tpt_indicacion_id FK
        date fecha_seguimiento
        boolean dosis_administrada
        text observaciones_administracion
        boolean efectos_adversos
        int establecimiento_id FK
        int usuario_registro_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    reacciones_adversas {
        int id PK
        int tpt_indicacion_id FK
        date fecha_reaccion
        varchar tipo_reaccion
        enum severidad
        text sintomas
        text accion_tomada
        varchar medicamento_sospechoso
        enum resultado
        int establecimiento_id FK
        int usuario_registro_id FK
        text observaciones
        timestamp created_at
        timestamp updated_at
    }
    
    visitas_domiciliarias {
        int id PK
        int contacto_id FK
        int caso_indice_id FK
        enum tipo_visita
        date fecha_visita
        date fecha_programada
        time hora_visita
        text direccion_visita
        enum resultado_visita
        text motivo_no_realizada
        text observaciones
        int establecimiento_id FK
        int usuario_visita_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    derivaciones_transferencias {
        int id PK
        int contacto_id FK
        int establecimiento_origen_id FK
        int establecimiento_destino_id FK
        enum tipo
        date fecha_solicitud
        date fecha_aceptacion
        text motivo
        enum estado
        text observaciones
        int usuario_solicita_id FK
        int usuario_acepta_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    alertas {
        int id PK
        enum tipo_alerta
        int contacto_id FK
        int caso_indice_id FK
        int tpt_indicacion_id FK
        int control_contacto_id FK
        int visita_domiciliaria_id FK
        enum severidad
        text mensaje
        date fecha_alerta
        date fecha_resolucion
        enum estado
        int usuario_resuelve_id FK
        text observaciones
        timestamp created_at
        timestamp updated_at
    }
    
    auditoria {
        int id PK
        int usuario_id FK
        varchar tabla_afectada
        int registro_id
        enum accion
        json datos_anteriores
        json datos_nuevos
        varchar ip_address
        text user_agent
        timestamp fecha_accion
        text observaciones
    }
    
    integraciones_log {
        int id PK
        enum sistema_externo
        enum tipo_operacion
        varchar endpoint
        json datos_enviados
        json datos_recibidos
        enum estado
        int codigo_respuesta
        text mensaje_error
        int usuario_id FK
        timestamp created_at
    }
```

## Relaciones Principales

```
casos_indice (1) ──< (N) contactos
contactos (1) ──< (N) examenes_contacto
contactos (1) ──< (N) controles_contacto
contactos (1) ──< (N) tpt_indicaciones
tpt_indicaciones (1) ──< (N) tpt_seguimiento
tpt_indicaciones (1) ──< (N) reacciones_adversas
contactos (1) ──< (N) visitas_domiciliarias
contactos (1) ──< (N) derivaciones_transferencias
```

## Características de Seguridad

- **Encriptación de contraseñas**: Las contraseñas se almacenan como hash (usar bcrypt en la aplicación)
- **Auditoría completa**: Todas las acciones se registran en la tabla `auditoria`
- **Roles y permisos**: Sistema de roles para control de acceso (RNF-01)
- **Trazabilidad**: Registro de usuario que realiza cada acción

## Notas Importantes

1. **Contraseñas de ejemplo**: Los usuarios en `init_data.sql` tienen contraseñas de ejemplo. **DEBEN ser cambiadas en producción**.

2. **Índices**: Se han creado índices en campos frecuentemente consultados para optimizar el rendimiento.

3. **Charset**: Se usa `utf8mb4` para soportar caracteres especiales y emojis.

4. **Foreign Keys**: Se usan restricciones de integridad referencial para mantener la consistencia de datos.

5. **Soft Deletes**: Muchas tablas tienen un campo `activo` para implementar borrado lógico en lugar de físico.

## Próximos Pasos

1. Configurar conexión desde el backend Node.js
2. Implementar migraciones de base de datos
3. Crear stored procedures si es necesario
4. Configurar backups automáticos

## Referencias Normativas

- **RF-01**: 5.2.13, 6.1.1.2.A - Censo de contactos
- **RF-02**: 5.2.13, 6.1.1.2.A - Examen integral
- **RF-03**: 6.1.1.2.A - Control de contactos
- **RF-04**: 6.1.1.2.B - Tablas N°2 a N°7
- **RF-05**: 6.1.1.2.B - Procedimientos para TPT
- **RF-06**: 6.1.2.3 - Formato Anexo N°13
- **RF-07**: 5.2.38 - Sistema nominal de gestión
- **RF-08**: 6.4.2.1.b.iii - Anexo N°15
- **RF-09**: 5.2.21, 5.2.42 - Flujos de referencia
- **RF-10**: 6.4.2.1.b.v - Prevención de pérdida de seguimiento
- **RNF-01**: 5.7 - Protección de datos personales
- **RNF-03**: 5.7 - Confidencialidad y Ley 29733
