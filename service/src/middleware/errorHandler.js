/**
 * Middleware para manejo de errores
 */
const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      message: err.message || 'Error interno del servidor',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };
    
    // Log del error
    console.error('Error:', {
      status: ctx.status,
      message: err.message,
      stack: err.stack,
      url: ctx.url,
      method: ctx.method
    });
  }
};

module.exports = errorHandler;
