/**
 * Middleware para registrar acciones en auditoría
 * Nota: Actualmente deshabilitado porque la tabla auditoria no existe en el esquema.
 * Para habilitarlo, crear el modelo Auditoria en models/ y descomentar el código.
 */
const auditLog = async (ctx, next) => {
  // const startTime = Date.now();
  
  await next();
  
  // Auditoría deshabilitada - la tabla no existe en el esquema actual
  // Si se necesita auditoría, crear el modelo y descomentar:
  /*
  if (['POST', 'PUT', 'DELETE'].includes(ctx.method) && ctx.state.user) {
    try {
      const { Auditoria } = require('../models');
      const executionTime = Date.now() - startTime;
      
      await Auditoria.create({
        usuario_id: ctx.state.user.id,
        tabla_afectada: ctx.path.split('/')[1] || 'unknown',
        accion: ctx.method,
        ip_address: ctx.ip,
        user_agent: ctx.headers['user-agent'] || '',
        observaciones: `Tiempo de ejecución: ${executionTime}ms`
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Auditoría no disponible:', error.message);
      }
    }
  }
  */
};

module.exports = auditLog;
