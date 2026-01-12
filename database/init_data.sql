-- =====================================================
-- Datos Iniciales para el Sistema de Monitoreo de TBC
-- =====================================================

USE tbc_monitoring;

-- =====================================================
-- INSERTAR ROLES (RNF-01)
-- =====================================================

INSERT INTO roles (nombre, descripcion) VALUES
('Administrador', 'Administrador del sistema con acceso completo'),
('Médico', 'Médico especialista en tuberculosis'),
('Enfermería', 'Personal de enfermería'),
('Trabajador Social', 'Trabajador social para visitas domiciliarias'),
('Nutricionista', 'Nutricionista para seguimiento nutricional'),
('Técnico de Laboratorio', 'Personal de laboratorio para exámenes'),
('Coordinador', 'Coordinador de programa de TB');

-- =====================================================
-- INSERTAR ESTABLECIMIENTOS DE SALUD
-- =====================================================

INSERT INTO establecimientos_salud (codigo, nombre, tipo, direccion, distrito, provincia, departamento) VALUES
('ESS001', 'Centro de Salud San Juan', 'Centro de Salud', 'Av. Principal 123', 'San Juan de Lurigancho', 'Lima', 'Lima'),
('ESS002', 'Hospital Nacional Dos de Mayo', 'Hospital', 'Av. Grau 800', 'Lima', 'Lima', 'Lima'),
('ESS003', 'Centro de Salud Villa El Salvador', 'Centro de Salud', 'Av. Central 456', 'Villa El Salvador', 'Lima', 'Lima'),
('ESS004', 'Hospital de Apoyo San Martín', 'Hospital', 'Jr. Los Olivos 789', 'San Martín de Porres', 'Lima', 'Lima');

-- =====================================================
-- INSERTAR USUARIOS DE PRUEBA
-- =====================================================
-- Nota: Las contraseñas son 'password123' hasheadas con bcrypt (10 rounds)
-- En producción, estas deben ser cambiadas inmediatamente

INSERT INTO usuarios (dni, nombres, apellidos, email, password_hash, rol_id, establecimiento_id) VALUES
('12345678', 'Juan', 'Pérez García', 'juan.perez@salud.gob.pe', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 1, 1),
('87654321', 'María', 'González López', 'maria.gonzalez@salud.gob.pe', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 2, 1),
('11223344', 'Carlos', 'Rodríguez Martínez', 'carlos.rodriguez@salud.gob.pe', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 3, 1),
('44332211', 'Ana', 'Sánchez Fernández', 'ana.sanchez@salud.gob.pe', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 4, 2);

-- =====================================================
-- INSERTAR ESQUEMAS DE TPT (RF-04)
-- =====================================================

INSERT INTO esquemas_tpt (codigo, nombre, descripcion, duracion_meses, medicamentos) VALUES
('TPT-01', 'Isoniazida 6 meses', 'Isoniazida diaria por 6 meses', 6, 'Isoniazida 300mg/día'),
('TPT-02', 'Isoniazida 9 meses', 'Isoniazida diaria por 9 meses', 9, 'Isoniazida 300mg/día'),
('TPT-03', 'Rifampicina 4 meses', 'Rifampicina diaria por 4 meses', 4, 'Rifampicina 600mg/día'),
('TPT-04', 'Isoniazida + Rifapentina 3 meses', 'Isoniazida + Rifapentina semanal por 3 meses', 3, 'Isoniazida 900mg + Rifapentina 900mg semanal'),
('TPT-05', 'Rifampicina + Isoniazida 3 meses', 'Rifampicina + Isoniazida diaria por 3 meses', 3, 'Rifampicina 600mg + Isoniazida 300mg/día');

-- =====================================================
-- DATOS DE EJEMPLO: CASOS ÍNDICE
-- =====================================================

INSERT INTO casos_indice (codigo_caso, paciente_dni, paciente_nombres, paciente_apellidos, fecha_nacimiento, sexo, tipo_tb, fecha_diagnostico, establecimiento_id, usuario_registro_id) VALUES
('CI-2024-001', '12345678', 'Pedro', 'Martínez Silva', '1980-05-15', 'M', 'Pulmonar', '2024-01-15', 1, 2),
('CI-2024-002', '23456789', 'Laura', 'Torres Vega', '1992-08-22', 'F', 'Pulmonar', '2024-02-10', 1, 2),
('CI-2024-003', '34567890', 'Roberto', 'Castro Díaz', '1975-11-30', 'M', 'Extrapulmonar', '2024-01-20', 2, 2);

-- =====================================================
-- DATOS DE EJEMPLO: CONTACTOS (RF-01)
-- =====================================================

INSERT INTO contactos (caso_indice_id, dni, nombres, apellidos, fecha_nacimiento, sexo, tipo_contacto, parentesco, direccion, telefono, establecimiento_id, usuario_registro_id, fecha_registro) VALUES
(1, '11111111', 'María', 'Martínez Silva', '2010-03-10', 'F', 'Intradomiciliario', 'Hija', 'Av. Principal 123, Dpto 201', '987654321', 1, 3, '2024-01-16'),
(1, '22222222', 'José', 'Martínez Silva', '2008-07-25', 'M', 'Intradomiciliario', 'Hijo', 'Av. Principal 123, Dpto 201', '987654321', 1, 3, '2024-01-16'),
(1, '33333333', 'Carmen', 'Silva López', '1985-09-12', 'F', 'Intradomiciliario', 'Esposa', 'Av. Principal 123, Dpto 201', '987654321', 1, 3, '2024-01-16'),
(1, '44444444', 'Luis', 'Martínez Pérez', '2015-12-05', 'M', 'Intradomiciliario', 'Hijo', 'Av. Principal 123, Dpto 201', '987654321', 1, 3, '2024-01-16'),
(2, '55555555', 'Miguel', 'Torres Vega', '1990-04-18', 'M', 'Extradomiciliario', 'Hermano', 'Av. Central 456', '987654322', 1, 3, '2024-02-11');

-- =====================================================
-- DATOS DE EJEMPLO: EXÁMENES (RF-02)
-- =====================================================

INSERT INTO examenes_contacto (contacto_id, fecha_examen, tipo_examen, resultado, resultado_codificado, establecimiento_id, usuario_registro_id) VALUES
(1, '2024-01-20', 'Integral', 'Examen clínico normal, PPD negativo, radiografía sin alteraciones', 'Negativo', 1, 2),
(2, '2024-01-20', 'Integral', 'Examen clínico normal, PPD positivo, radiografía sin alteraciones', 'PPD Positivo', 1, 2),
(3, '2024-01-20', 'Integral', 'Examen clínico normal, PPD negativo, radiografía sin alteraciones', 'Negativo', 1, 2),
(4, '2024-01-20', 'Integral', 'Examen clínico normal, PPD negativo, radiografía sin alteraciones', 'Negativo', 1, 2);

-- =====================================================
-- DATOS DE EJEMPLO: CONTROLES (RF-03)
-- =====================================================

INSERT INTO controles_contacto (contacto_id, numero_control, fecha_programada, fecha_realizada, tipo_control, resultado, estado, establecimiento_id, usuario_programa_id, usuario_realiza_id) VALUES
(1, 1, '2024-02-20', '2024-02-20', 'Integral', 'Sin cambios, PPD negativo', 'Realizado', 1, 2, 2),
(1, 2, '2024-03-20', NULL, 'Integral', NULL, 'Programado', 1, 2, NULL),
(2, 1, '2024-02-20', '2024-02-20', 'Integral', 'PPD positivo, sin síntomas', 'Realizado', 1, 2, 2),
(2, 2, '2024-03-20', NULL, 'Integral', NULL, 'Programado', 1, 2, NULL),
(3, 1, '2024-02-20', '2024-02-20', 'Integral', 'Sin cambios', 'Realizado', 1, 2, 2);

-- =====================================================
-- DATOS DE EJEMPLO: TPT (RF-04)
-- =====================================================

INSERT INTO tpt_indicaciones (contacto_id, esquema_tpt_id, fecha_indicacion, fecha_inicio, fecha_fin_prevista, estado, motivo_indicacion, establecimiento_id, usuario_indicacion_id) VALUES
(2, 1, '2024-02-21', '2024-02-25', '2024-08-25', 'En curso', 'PPD positivo, contacto intradomiciliario de caso índice con TB pulmonar', 1, 2);

-- =====================================================
-- DATOS DE EJEMPLO: CONSENTIMIENTO TPT (RF-05)
-- =====================================================

INSERT INTO tpt_consentimientos (tpt_indicacion_id, fecha_consentimiento, consentimiento_firmado, usuario_registro_id) VALUES
(1, '2024-02-21', TRUE, 2);

-- =====================================================
-- DATOS DE EJEMPLO: SEGUIMIENTO TPT
-- =====================================================

INSERT INTO tpt_seguimiento (tpt_indicacion_id, fecha_seguimiento, dosis_administrada, observaciones_administracion, efectos_adversos, establecimiento_id, usuario_registro_id) VALUES
(1, '2024-02-25', TRUE, 'Primera dosis administrada correctamente', FALSE, 1, 3),
(1, '2024-03-04', TRUE, 'Dosis administrada, paciente sin quejas', FALSE, 1, 3),
(1, '2024-03-11', TRUE, 'Dosis administrada, paciente refiere ligera náusea', TRUE, 1, 3);

-- =====================================================
-- DATOS DE EJEMPLO: REACCIONES ADVERSAS (RF-06)
-- =====================================================

INSERT INTO reacciones_adversas (tpt_indicacion_id, fecha_reaccion, tipo_reaccion, severidad, sintomas, accion_tomada, medicamento_sospechoso, resultado, establecimiento_id, usuario_registro_id) VALUES
(1, '2024-03-11', 'Gastrointestinal', 'Leve', 'Náusea leve después de la dosis', 'Se recomendó tomar con alimentos, continuar con el esquema', 'Isoniazida', 'Resuelto', 1, 2);

-- =====================================================
-- DATOS DE EJEMPLO: VISITAS DOMICILIARIAS (RF-08)
-- =====================================================

INSERT INTO visitas_domiciliarias (contacto_id, caso_indice_id, tipo_visita, fecha_visita, fecha_programada, hora_visita, direccion_visita, resultado_visita, observaciones, establecimiento_id, usuario_visita_id) VALUES
(1, 1, 'Primer contacto', '2024-01-18', '2024-01-18', '10:00:00', 'Av. Principal 123, Dpto 201', 'Realizada', 'Se realizó evaluación inicial, se explicó el programa de seguimiento', 1, 4),
(2, 1, 'Primer contacto', '2024-01-18', '2024-01-18', '10:30:00', 'Av. Principal 123, Dpto 201', 'Realizada', 'Contacto evaluado, se indicó TPT', 1, 4),
(1, NULL, 'Seguimiento', '2024-02-20', '2024-02-20', '14:00:00', 'Av. Principal 123, Dpto 201', 'Realizada', 'Seguimiento de control, todo normal', 1, 4);

-- =====================================================
-- DATOS DE EJEMPLO: ALERTAS (RF-10)
-- =====================================================

INSERT INTO alertas (tipo_alerta, contacto_id, severidad, mensaje, fecha_alerta, estado, observaciones) VALUES
('Control no realizado', 3, 'Media', 'El contacto tiene un control programado vencido desde hace 5 días', '2024-03-25', 'Activa', 'Requiere seguimiento urgente'),
('TPT no iniciada', 2, 'Alta', 'TPT indicada hace 10 días pero aún no se ha iniciado', '2024-03-03', 'Resuelta', 'Se inició el 2024-02-25');
