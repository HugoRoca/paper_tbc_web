-- =====================================================
-- Sistema de Monitoreo de Tuberculosis (TBC)
-- Esquema de Base de Datos MySQL
-- =====================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS tbc_monitoring CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tbc_monitoring;

-- =====================================================
-- TABLAS DE CONFIGURACIÓN Y SISTEMA
-- =====================================================

-- Tabla de roles de usuario (RNF-01)
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de usuarios del sistema (RNF-01)
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dni VARCHAR(20) UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    establecimiento_id INT,
    activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id),
    INDEX idx_email (email),
    INDEX idx_dni (dni),
    INDEX idx_rol (rol_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de establecimientos de salud (RF-09)
CREATE TABLE establecimientos_salud (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    tipo VARCHAR(50), -- Centro de Salud, Hospital, etc.
    direccion TEXT,
    distrito VARCHAR(100),
    provincia VARCHAR(100),
    departamento VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agregar foreign key de establecimiento a usuarios
ALTER TABLE usuarios ADD FOREIGN KEY (establecimiento_id) REFERENCES establecimientos_salud(id);

-- =====================================================
-- TABLAS DE PACIENTES Y CASOS ÍNDICE
-- =====================================================

-- Tabla de casos índice (pacientes con TB confirmada)
CREATE TABLE casos_indice (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo_caso VARCHAR(50) UNIQUE NOT NULL,
    paciente_dni VARCHAR(20),
    paciente_nombres VARCHAR(100) NOT NULL,
    paciente_apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    sexo ENUM('M', 'F', 'Otro'),
    tipo_tb ENUM('Pulmonar', 'Extrapulmonar', 'Miliar', 'Meningea') NOT NULL,
    fecha_diagnostico DATE NOT NULL,
    establecimiento_id INT NOT NULL,
    usuario_registro_id INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (establecimiento_id) REFERENCES establecimientos_salud(id),
    FOREIGN KEY (usuario_registro_id) REFERENCES usuarios(id),
    INDEX idx_codigo_caso (codigo_caso),
    INDEX idx_dni (paciente_dni),
    INDEX idx_tipo_tb (tipo_tb)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLAS DE CONTACTOS (RF-01)
-- =====================================================

-- Tabla de contactos (intradomiciliarios y extradomiciliarios)
CREATE TABLE contactos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    caso_indice_id INT NOT NULL,
    dni VARCHAR(20),
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    sexo ENUM('M', 'F', 'Otro'),
    tipo_contacto ENUM('Intradomiciliario', 'Extradomiciliario') NOT NULL,
    parentesco VARCHAR(50), -- Padre, Madre, Hijo, etc.
    direccion TEXT,
    telefono VARCHAR(20),
    establecimiento_id INT NOT NULL,
    usuario_registro_id INT NOT NULL,
    fecha_registro DATE NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (caso_indice_id) REFERENCES casos_indice(id) ON DELETE RESTRICT,
    FOREIGN KEY (establecimiento_id) REFERENCES establecimientos_salud(id),
    FOREIGN KEY (usuario_registro_id) REFERENCES usuarios(id),
    INDEX idx_caso_indice (caso_indice_id),
    INDEX idx_dni (dni),
    INDEX idx_tipo_contacto (tipo_contacto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLAS DE EXÁMENES (RF-02)
-- =====================================================

-- Tabla de exámenes integrales del contacto
CREATE TABLE examenes_contacto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contacto_id INT NOT NULL,
    fecha_examen DATE NOT NULL,
    tipo_examen ENUM('Clínico', 'Radiológico', 'Inmunológico', 'Bacteriológico', 'Integral') NOT NULL,
    resultado TEXT,
    resultado_codificado VARCHAR(50), -- Positivo, Negativo, Pendiente, etc.
    establecimiento_id INT NOT NULL,
    usuario_registro_id INT NOT NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contacto_id) REFERENCES contactos(id) ON DELETE RESTRICT,
    FOREIGN KEY (establecimiento_id) REFERENCES establecimientos_salud(id),
    FOREIGN KEY (usuario_registro_id) REFERENCES usuarios(id),
    INDEX idx_contacto (contacto_id),
    INDEX idx_fecha_examen (fecha_examen),
    INDEX idx_tipo_examen (tipo_examen)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLAS DE CONTROLES (RF-03)
-- =====================================================

-- Tabla de programación de controles de contactos
CREATE TABLE controles_contacto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contacto_id INT NOT NULL,
    numero_control INT NOT NULL, -- 1, 2, 3, etc.
    fecha_programada DATE NOT NULL,
    fecha_realizada DATE NULL,
    tipo_control ENUM('Clínico', 'Radiológico', 'Bacteriológico', 'Integral') NOT NULL,
    resultado TEXT,
    estado ENUM('Programado', 'Realizado', 'No realizado', 'Cancelado') DEFAULT 'Programado',
    establecimiento_id INT NOT NULL,
    usuario_programa_id INT NOT NULL,
    usuario_realiza_id INT NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contacto_id) REFERENCES contactos(id) ON DELETE RESTRICT,
    FOREIGN KEY (establecimiento_id) REFERENCES establecimientos_salud(id),
    FOREIGN KEY (usuario_programa_id) REFERENCES usuarios(id),
    FOREIGN KEY (usuario_realiza_id) REFERENCES usuarios(id),
    INDEX idx_contacto (contacto_id),
    INDEX idx_fecha_programada (fecha_programada),
    INDEX idx_estado (estado),
    UNIQUE KEY unique_control_contacto (contacto_id, numero_control)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLAS DE TERAPIA PREVENTIVA (TPT) (RF-04, RF-05)
-- =====================================================

-- Tabla de esquemas de TPT
CREATE TABLE esquemas_tpt (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion_meses INT NOT NULL,
    medicamentos TEXT, -- JSON o texto con los medicamentos
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de indicaciones de TPT
CREATE TABLE tpt_indicaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contacto_id INT NOT NULL,
    esquema_tpt_id INT NOT NULL,
    fecha_indicacion DATE NOT NULL,
    fecha_inicio DATE,
    fecha_fin_prevista DATE,
    estado ENUM('Indicado', 'En curso', 'Completado', 'Suspenso', 'Abandonado') DEFAULT 'Indicado',
    motivo_indicacion TEXT,
    establecimiento_id INT NOT NULL,
    usuario_indicacion_id INT NOT NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contacto_id) REFERENCES contactos(id) ON DELETE RESTRICT,
    FOREIGN KEY (esquema_tpt_id) REFERENCES esquemas_tpt(id),
    FOREIGN KEY (establecimiento_id) REFERENCES establecimientos_salud(id),
    FOREIGN KEY (usuario_indicacion_id) REFERENCES usuarios(id),
    INDEX idx_contacto (contacto_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha_inicio (fecha_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de consentimiento informado para TPT (RF-05 - Anexo N°9)
CREATE TABLE tpt_consentimientos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tpt_indicacion_id INT NOT NULL,
    fecha_consentimiento DATE NOT NULL,
    consentimiento_firmado BOOLEAN DEFAULT FALSE,
    ruta_archivo_consentimiento VARCHAR(500), -- Ruta al archivo escaneado
    usuario_registro_id INT NOT NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tpt_indicacion_id) REFERENCES tpt_indicaciones(id) ON DELETE RESTRICT,
    FOREIGN KEY (usuario_registro_id) REFERENCES usuarios(id),
    UNIQUE KEY unique_tpt_consentimiento (tpt_indicacion_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de seguimiento y administración de TPT
CREATE TABLE tpt_seguimiento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tpt_indicacion_id INT NOT NULL,
    fecha_seguimiento DATE NOT NULL,
    dosis_administrada BOOLEAN DEFAULT FALSE,
    observaciones_administracion TEXT,
    efectos_adversos BOOLEAN DEFAULT FALSE,
    establecimiento_id INT NOT NULL,
    usuario_registro_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tpt_indicacion_id) REFERENCES tpt_indicaciones(id) ON DELETE RESTRICT,
    FOREIGN KEY (establecimiento_id) REFERENCES establecimientos_salud(id),
    FOREIGN KEY (usuario_registro_id) REFERENCES usuarios(id),
    INDEX idx_tpt_indicacion (tpt_indicacion_id),
    INDEX idx_fecha_seguimiento (fecha_seguimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLAS DE REACCIONES ADVERSAS (RF-06)
-- =====================================================

-- Tabla de reacciones adversas a medicamentos (RAM)
CREATE TABLE reacciones_adversas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tpt_indicacion_id INT NOT NULL,
    fecha_reaccion DATE NOT NULL,
    tipo_reaccion VARCHAR(100) NOT NULL,
    severidad ENUM('Leve', 'Moderada', 'Severa', 'Grave') NOT NULL,
    sintomas TEXT NOT NULL,
    accion_tomada TEXT,
    medicamento_sospechoso VARCHAR(200),
    resultado ENUM('En seguimiento', 'Resuelto', 'Pendiente') DEFAULT 'En seguimiento',
    establecimiento_id INT NOT NULL,
    usuario_registro_id INT NOT NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tpt_indicacion_id) REFERENCES tpt_indicaciones(id) ON DELETE RESTRICT,
    FOREIGN KEY (establecimiento_id) REFERENCES establecimientos_salud(id),
    FOREIGN KEY (usuario_registro_id) REFERENCES usuarios(id),
    INDEX idx_tpt_indicacion (tpt_indicacion_id),
    INDEX idx_fecha_reaccion (fecha_reaccion),
    INDEX idx_severidad (severidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLAS DE VISITAS DOMICILIARIAS (RF-08)
-- =====================================================

-- Tabla de visitas domiciliarias
CREATE TABLE visitas_domiciliarias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contacto_id INT,
    caso_indice_id INT,
    tipo_visita ENUM('Primer contacto', 'Seguimiento') NOT NULL,
    fecha_visita DATE NOT NULL,
    fecha_programada DATE,
    hora_visita TIME,
    direccion_visita TEXT NOT NULL,
    resultado_visita ENUM('Realizada', 'No realizada', 'Reagendada') DEFAULT 'Realizada',
    motivo_no_realizada TEXT,
    observaciones TEXT,
    establecimiento_id INT NOT NULL,
    usuario_visita_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contacto_id) REFERENCES contactos(id) ON DELETE SET NULL,
    FOREIGN KEY (caso_indice_id) REFERENCES casos_indice(id) ON DELETE SET NULL,
    FOREIGN KEY (establecimiento_id) REFERENCES establecimientos_salud(id),
    FOREIGN KEY (usuario_visita_id) REFERENCES usuarios(id),
    INDEX idx_contacto (contacto_id),
    INDEX idx_caso_indice (caso_indice_id),
    INDEX idx_fecha_visita (fecha_visita),
    INDEX idx_tipo_visita (tipo_visita)
    -- Nota: La validación de que al menos uno de contacto_id o caso_indice_id debe ser NOT NULL
    -- se maneja a nivel de aplicación debido a limitaciones de MySQL con CHECK constraints
    -- cuando hay foreign keys con ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLAS DE DERIVACIONES Y TRANSFERENCIAS (RF-09)
-- =====================================================

-- Tabla de derivaciones y transferencias entre establecimientos
CREATE TABLE derivaciones_transferencias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contacto_id INT NOT NULL,
    establecimiento_origen_id INT NOT NULL,
    establecimiento_destino_id INT NOT NULL,
    tipo ENUM('Derivación', 'Transferencia') NOT NULL,
    fecha_solicitud DATE NOT NULL,
    fecha_aceptacion DATE,
    motivo TEXT NOT NULL,
    estado ENUM('Pendiente', 'Aceptada', 'Rechazada', 'Completada') DEFAULT 'Pendiente',
    observaciones TEXT,
    usuario_solicita_id INT NOT NULL,
    usuario_acepta_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contacto_id) REFERENCES contactos(id) ON DELETE RESTRICT,
    FOREIGN KEY (establecimiento_origen_id) REFERENCES establecimientos_salud(id),
    FOREIGN KEY (establecimiento_destino_id) REFERENCES establecimientos_salud(id),
    FOREIGN KEY (usuario_solicita_id) REFERENCES usuarios(id),
    FOREIGN KEY (usuario_acepta_id) REFERENCES usuarios(id),
    INDEX idx_contacto (contacto_id),
    INDEX idx_establecimiento_origen (establecimiento_origen_id),
    INDEX idx_establecimiento_destino (establecimiento_destino_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLAS DE ALERTAS (RF-10)
-- =====================================================

-- Tabla de alertas por incumplimiento
CREATE TABLE alertas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo_alerta ENUM('Control no realizado', 'TPT no iniciada', 'TPT abandonada', 'Visita no realizada', 'Otro') NOT NULL,
    contacto_id INT,
    caso_indice_id INT,
    tpt_indicacion_id INT,
    control_contacto_id INT,
    visita_domiciliaria_id INT,
    severidad ENUM('Baja', 'Media', 'Alta', 'Crítica') DEFAULT 'Media',
    mensaje TEXT NOT NULL,
    fecha_alerta DATE NOT NULL,
    fecha_resolucion DATE,
    estado ENUM('Activa', 'En revisión', 'Resuelta', 'Descartada') DEFAULT 'Activa',
    usuario_resuelve_id INT,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contacto_id) REFERENCES contactos(id) ON DELETE SET NULL,
    FOREIGN KEY (caso_indice_id) REFERENCES casos_indice(id) ON DELETE SET NULL,
    FOREIGN KEY (tpt_indicacion_id) REFERENCES tpt_indicaciones(id) ON DELETE SET NULL,
    FOREIGN KEY (control_contacto_id) REFERENCES controles_contacto(id) ON DELETE SET NULL,
    FOREIGN KEY (visita_domiciliaria_id) REFERENCES visitas_domiciliarias(id) ON DELETE SET NULL,
    FOREIGN KEY (usuario_resuelve_id) REFERENCES usuarios(id),
    INDEX idx_tipo_alerta (tipo_alerta),
    INDEX idx_estado (estado),
    INDEX idx_fecha_alerta (fecha_alerta),
    INDEX idx_severidad (severidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLAS DE AUDITORÍA (RNF-03)
-- =====================================================

-- Tabla de auditoría y trazabilidad de acciones
CREATE TABLE auditoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    tabla_afectada VARCHAR(100) NOT NULL,
    registro_id INT,
    accion ENUM('INSERT', 'UPDATE', 'DELETE', 'SELECT', 'LOGIN', 'LOGOUT') NOT NULL,
    datos_anteriores JSON,
    datos_nuevos JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_usuario (usuario_id),
    INDEX idx_tabla (tabla_afectada),
    INDEX idx_accion (accion),
    INDEX idx_fecha_accion (fecha_accion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLAS DE INTEGRACIÓN (RF-07, RNF-02)
-- =====================================================

-- Tabla para registro de integraciones con sistemas externos (SIGTB, NETLAB)
CREATE TABLE integraciones_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sistema_externo ENUM('SIGTB', 'NETLAB', 'Otro') NOT NULL,
    tipo_operacion ENUM('Consulta', 'Envío', 'Recepción', 'Sincronización') NOT NULL,
    endpoint VARCHAR(500),
    datos_enviados JSON,
    datos_recibidos JSON,
    estado ENUM('Exitoso', 'Error', 'Pendiente') NOT NULL,
    codigo_respuesta INT,
    mensaje_error TEXT,
    usuario_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_sistema (sistema_externo),
    INDEX idx_estado (estado),
    INDEX idx_fecha (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices compuestos para consultas frecuentes
CREATE INDEX idx_contacto_estado ON contactos(activo, tipo_contacto);
CREATE INDEX idx_tpt_estado_fecha ON tpt_indicaciones(estado, fecha_inicio);
CREATE INDEX idx_control_estado_fecha ON controles_contacto(estado, fecha_programada);
CREATE INDEX idx_alerta_estado_severidad ON alertas(estado, severidad);
