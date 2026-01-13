const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { Usuario, Role } = require('../models');

/**
 * Middleware de autenticación JWT
 */
const authenticate = async (ctx, next) => {
  try {
    const authHeader = ctx.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: 'Token de autenticación requerido'
      };
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, jwtConfig.secret);
    
    // Verificar que el usuario existe y está activo
    const user = await Usuario.findByPk(decoded.userId, {
      include: [{
        model: Role,
        as: 'rol',
        attributes: ['id', 'nombre']
      }]
    });
    
    if (!user || !user.activo) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: 'Usuario no válido o inactivo'
      };
      return;
    }

    const userData = user.toJSON();
    // Agregar información del usuario al contexto
    ctx.state.user = {
      id: userData.id,
      email: userData.email,
      rol_id: userData.rol_id,
      establecimiento_id: userData.establecimiento_id
    };

    await next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: 'Token inválido o expirado'
      };
      return;
    }
    
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Error en la autenticación',
      error: error.message
    };
  }
};

/**
 * Middleware para verificar roles específicos
 */
const authorize = (...allowedRoles) => {
  return async (ctx, next) => {
    if (!ctx.state.user) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: 'No autenticado'
      };
      return;
    }

    const userRole = ctx.state.user.rol_id;
    
    // Obtener el nombre del rol
    const role = await Role.findByPk(userRole);
    
    if (!role || !allowedRoles.includes(role.nombre)) {
      ctx.status = 403;
      ctx.body = {
        success: false,
        message: 'No tiene permisos para acceder a este recurso'
      };
      return;
    }

    await next();
  };
};

module.exports = {
  authenticate,
  authorize
};
