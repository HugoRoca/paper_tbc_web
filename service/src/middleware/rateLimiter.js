const RateLimit = require('koa-ratelimit');

/**
 * Rate limiter para prevenir abuso de la API
 */
const rateLimiter = RateLimit({
  driver: 'memory',
  db: new Map(),
  duration: 60000, // 1 minuto
  errorMessage: 'Demasiadas solicitudes, por favor intenta más tarde',
  id: (ctx) => ctx.ip,
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total'
  },
  max: 100, // 100 requests por minuto por IP
  disableHeader: false,
  whitelist: (ctx) => {
    // Permitir más requests para usuarios autenticados
    return false;
  },
  blacklist: (ctx) => {
    // Bloquear IPs específicas si es necesario
    return false;
  }
});

/**
 * Rate limiter más estricto para endpoints de autenticación
 */
const authRateLimiter = RateLimit({
  driver: 'memory',
  db: new Map(),
  duration: 900000, // 15 minutos
  errorMessage: 'Demasiados intentos de login, por favor intenta más tarde',
  id: (ctx) => ctx.ip,
  max: 5, // 5 intentos por 15 minutos
  disableHeader: false
});

module.exports = {
  rateLimiter,
  authRateLimiter
};
