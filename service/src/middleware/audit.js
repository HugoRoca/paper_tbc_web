/**
 * Middleware para registrar acciones en auditoría
 */
const auditLog = async (ctx, next) => {
  // Requerir modelos dentro del middleware para evitar problemas de inicialización
  const { Auditoria, sequelize } = require('../models');
  // Manejar LOGIN de forma especial (no requiere autenticación previa)
  const isLogin = ctx.path === '/api/auth/login' && ctx.method === 'POST';
  const isLogout = ctx.path === '/api/auth/logout' && ctx.method === 'POST';
  
  // Determinar si deberíamos auditar esta operación
  const shouldAudit = ['POST', 'PUT', 'DELETE'].includes(ctx.method);
  
  if (!shouldAudit) {
    return await next();
  }

  // Capturar datos anteriores para UPDATE y DELETE
  let datosAnteriores = null;
  let registroId = null;
  
  // Extraer registro_id de la URL si existe
  const pathParts = ctx.path.split('/').filter(p => p);
  const apiIndex = pathParts.indexOf('api');
  if (apiIndex !== -1 && pathParts.length > apiIndex + 2) {
    const potentialId = parseInt(pathParts[apiIndex + 2]);
    if (!isNaN(potentialId)) {
      registroId = potentialId;
    }
  }

  // Para UPDATE y DELETE, obtener datos anteriores antes de ejecutar la operación
  // No hacer esto para LOGIN/LOGOUT
  if ((ctx.method === 'PUT' || ctx.method === 'DELETE') && registroId && !isLogin && !isLogout) {
    try {
      const tablaNombre = pathParts[apiIndex + 1];
      
      // Mapear nombres de rutas a nombres de tablas
      const tablaMap = {
        'casos-indice': 'casos_indice',
        'contactos': 'contactos',
        'examenes-contacto': 'examenes_contacto',
        'controles-contacto': 'controles_contacto',
        'esquemas-tpt': 'esquemas_tpt',
        'tpt-indicaciones': 'tpt_indicaciones',
        'tpt-consentimientos': 'tpt_consentimientos',
        'tpt-seguimiento': 'tpt_seguimiento',
        'reacciones-adversas': 'reacciones_adversas',
        'visitas-domiciliarias': 'visitas_domiciliarias',
        'derivaciones-transferencias': 'derivaciones_transferencias',
        'alertas': 'alertas',
        'establecimientos-salud': 'establecimientos_salud',
        'usuarios': 'usuarios',
        'roles': 'roles'
      };
      
      const nombreTabla = tablaMap[tablaNombre] || tablaNombre.replace(/-/g, '_');
      
      // Obtener datos anteriores usando query directa
      const results = await sequelize.query(
        `SELECT * FROM ${nombreTabla} WHERE id = :id LIMIT 1`,
        {
          replacements: { id: registroId },
          type: sequelize.QueryTypes.SELECT
        }
      );
      
      if (results && results.length > 0) {
        datosAnteriores = results[0];
      }
    } catch (error) {
      // Si no se pueden obtener datos anteriores, continuar sin ellos
      if (process.env.NODE_ENV === 'development') {
        console.warn('No se pudieron obtener datos anteriores para auditoría:', error.message);
      }
    }
  }

  // Ejecutar la operación primero
  await next();

  // Registrar en auditoría después de la operación
  // Solo registrar si la operación fue exitosa (status 200-299) y no hay error explícito
  const isSuccess = ctx.status >= 200 && ctx.status < 300;
  const hasError = ctx.body?.success === false || ctx.body?.error;
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Audit middleware - Verificando:', {
      path: ctx.path,
      method: ctx.method,
      status: ctx.status,
      isSuccess,
      hasError,
      hasUser: !!ctx.state.user,
      isLogin
    });
  }

  if (isSuccess && !hasError) {
    try {
      
      // Determinar la acción y obtener usuario_id
      let accion = 'SELECT';
      let usuarioId = null;
      
      if (isLogin) {
        accion = 'LOGIN';
        // Para LOGIN, obtener el usuario_id de la respuesta
        // La estructura es: { success: true, data: { token, user: { id, ... } } }
        if (ctx.body?.data?.user?.id) {
          usuarioId = ctx.body.data.user.id;
        } else if (ctx.body?.data?.id) {
          usuarioId = ctx.body.data.id;
        } else if (ctx.body?.data?.token) {
          // Si hay token, intentar decodificarlo para obtener el usuario_id
          try {
            const jwt = require('jsonwebtoken');
            const jwtConfig = require('../config/jwt');
            const decoded = jwt.decode(ctx.body.data.token); // Usar decode en lugar de verify para evitar errores
            if (decoded && decoded.userId) {
              usuarioId = decoded.userId;
            }
          } catch (e) {
            // Si no se puede decodificar, continuar sin usuario_id
            if (process.env.NODE_ENV === 'development') {
              console.warn('No se pudo obtener usuario_id del token:', e.message);
            }
          }
        }
      } else if (isLogout) {
        accion = 'LOGOUT';
        usuarioId = ctx.state.user?.id;
      } else if (ctx.method === 'POST') {
        accion = 'INSERT';
        usuarioId = ctx.state.user?.id;
      } else if (ctx.method === 'PUT') {
        accion = 'UPDATE';
        usuarioId = ctx.state.user?.id;
      } else if (ctx.method === 'DELETE') {
        accion = 'DELETE';
        usuarioId = ctx.state.user?.id;
      }
      
      // Si no hay usuario_id (excepto para LOGIN que puede no tenerlo si falla), no registrar auditoría
      if (!usuarioId && !isLogin) {
        // En desarrollo, loggear cuando no se puede auditar
        if (process.env.NODE_ENV === 'development') {
          console.log('Auditoría omitida: no hay usuario_id para', ctx.method, ctx.path);
        }
        return;
      }
      
      // Para LOGIN, si no hay usuario_id después de la operación exitosa, no registrar
      if (isLogin && !usuarioId) {
        return;
      }

      // Extraer tabla afectada (ya tenemos pathParts definido arriba)
      const tablaNombre = apiIndex !== -1 ? pathParts[apiIndex + 1] : 'unknown';
      
      // Mapear nombres de rutas a nombres de tablas más legibles
      const tablaDisplayMap = {
        'casos-indice': 'casos_indice',
        'contactos': 'contactos',
        'examenes-contacto': 'examenes_contacto',
        'controles-contacto': 'controles_contacto',
        'esquemas-tpt': 'esquemas_tpt',
        'tpt-indicaciones': 'tpt_indicaciones',
        'tpt-consentimientos': 'tpt_consentimientos',
        'tpt-seguimiento': 'tpt_seguimiento',
        'reacciones-adversas': 'reacciones_adversas',
        'visitas-domiciliarias': 'visitas_domiciliarias',
        'derivaciones-transferencias': 'derivaciones_transferencias',
        'alertas': 'alertas',
        'establecimientos-salud': 'establecimientos_salud',
        'usuarios': 'usuarios',
        'roles': 'roles',
        'auth': 'usuarios' // Login/Logout se registran como usuarios
      };
      
      const tablaAfectada = tablaDisplayMap[tablaNombre] || tablaNombre.replace(/-/g, '_');

      // Obtener registro_id de la respuesta si no se tenía antes
      if (!registroId && ctx.body?.data?.id) {
        registroId = ctx.body.data.id;
      } else if (!registroId && ctx.body?.data && typeof ctx.body.data === 'object' && 'id' in ctx.body.data) {
        registroId = ctx.body.data.id;
      }

      // Capturar datos nuevos
      let datosNuevos = null;
      if (ctx.method === 'POST' || ctx.method === 'PUT') {
        if (ctx.body?.data) {
          datosNuevos = ctx.body.data;
        } else if (ctx.request.body) {
          datosNuevos = ctx.request.body;
        }
      }

      // Limpiar datos sensibles antes de guardar
      const cleanData = (data) => {
        if (!data || typeof data !== 'object') return data;
        const cleaned = { ...data };
        const sensitiveFields = ['password', 'password_hash', 'passwordHash', 'token'];
        sensitiveFields.forEach(field => {
          if (cleaned[field]) {
            cleaned[field] = '***REDACTED***';
          }
        });
        return cleaned;
      };

      // Para LOGIN, la tabla afectada es 'usuarios'
      const tablaFinal = isLogin || isLogout ? 'usuarios' : tablaAfectada;
      
      const auditData = {
        usuario_id: usuarioId,
        tabla_afectada: tablaFinal,
        registro_id: registroId || (isLogin && usuarioId ? usuarioId : null),
        accion: accion,
        datos_anteriores: datosAnteriores ? cleanData(datosAnteriores) : null,
        datos_nuevos: datosNuevos ? cleanData(datosNuevos) : (isLogin && ctx.body?.data ? cleanData(ctx.body.data) : null),
        ip_address: ctx.ip || ctx.request.ip || null,
        user_agent: ctx.headers['user-agent'] || null,
        observaciones: ctx.method === 'DELETE' ? 'Registro eliminado' : (isLogin ? 'Inicio de sesión exitoso' : null)
      };

      // Log en desarrollo para debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Registrando auditoría:', {
          accion,
          tabla: tablaFinal,
          usuario_id: usuarioId,
          registro_id: auditData.registro_id,
          path: ctx.path,
          method: ctx.method
        });
      }

      await Auditoria.create(auditData);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Auditoría registrada exitosamente');
      }
    } catch (error) {
      // No fallar la petición si la auditoría falla
      console.error('Error al registrar auditoría:', error.message);
      if (process.env.NODE_ENV === 'development') {
        console.error('Stack trace:', error.stack);
      }
    }
  }
};

module.exports = auditLog;
