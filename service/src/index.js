const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const helmet = require('koa-helmet');
const json = require('koa-json');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const auditLog = require('./middleware/audit');
const { rateLimiter, authRateLimiter } = require('./middleware/rateLimiter');

// Inicializar modelos Sequelize (debe ir antes de las rutas)
const { sequelize } = require('./models');

// Routes
const authRoutes = require('./routes/authRoutes');
const casoIndiceRoutes = require('./routes/casoIndiceRoutes');
const contactoRoutes = require('./routes/contactoRoutes');
const examenContactoRoutes = require('./routes/examenContactoRoutes');
const controlContactoRoutes = require('./routes/controlContactoRoutes');
const esquemaTptRoutes = require('./routes/esquemaTptRoutes');
const tptIndicacionRoutes = require('./routes/tptIndicacionRoutes');
const tptConsentimientoRoutes = require('./routes/tptConsentimientoRoutes');
const tptSeguimientoRoutes = require('./routes/tptSeguimientoRoutes');
const reaccionAdversaRoutes = require('./routes/reaccionAdversaRoutes');
const visitaDomiciliariaRoutes = require('./routes/visitaDomiciliariaRoutes');
const derivacionTransferenciaRoutes = require('./routes/derivacionTransferenciaRoutes');
const alertaRoutes = require('./routes/alertaRoutes');
const establecimientoSaludRoutes = require('./routes/establecimientoSaludRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const auditoriaRoutes = require('./routes/auditoriaRoutes');
const integracionLogRoutes = require('./routes/integracionLogRoutes');
const integracionRoutes = require('./routes/integracionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Swagger
const swaggerSpec = require('./config/swagger');
const { koaSwagger } = require('koa2-swagger-ui');

const app = new Koa();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false // Deshabilitar CSP para Swagger UI
}));
// Configurar CORS para permitir múltiples orígenes
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:3001', 'http://localhost:3002'];

app.use(cors({
  origin: (ctx) => {
    const origin = ctx.request.header.origin;
    if (allowedOrigins.includes(origin)) {
      return origin;
    }
    return allowedOrigins[0]; // Fallback al primer origen permitido
  },
  credentials: true
}));
app.use(logger());
app.use(json());
app.use(bodyParser({
  jsonLimit: '10mb',
  formLimit: '10mb'
}));

// Router para Swagger JSON
const swaggerRouter = new Router();
swaggerRouter.get('/api-docs.json', async (ctx) => {
  ctx.set('Content-Type', 'application/json');
  ctx.body = swaggerSpec;
});
app.use(swaggerRouter.routes()).use(swaggerRouter.allowedMethods());

// Rate limiting (excluir endpoints de Swagger)
app.use(async (ctx, next) => {
  // No aplicar rate limiting a Swagger
  if (ctx.path.startsWith('/api-docs') || ctx.path === '/swagger.json') {
    return await next();
  }
  return rateLimiter(ctx, next);
});

// Error handler
app.use(errorHandler);

// Swagger documentation
app.use(
  koaSwagger({
    routePrefix: '/api-docs',
    swaggerOptions: {
      url: '/api-docs.json',
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestHeaders: true
    },
    hideTopbar: true,
    customCss: '.swagger-ui .topbar { display: none }'
  })
);

// Health check
app.use(async (ctx, next) => {
  if (ctx.path === '/health') {
    ctx.body = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'tbc-monitoring-api'
    };
    return;
  }
  await next();
});

// Routes
app.use(auditLog);
app.use(authRoutes.routes()).use(authRoutes.allowedMethods());
app.use(casoIndiceRoutes.routes()).use(casoIndiceRoutes.allowedMethods());
app.use(contactoRoutes.routes()).use(contactoRoutes.allowedMethods());
app.use(examenContactoRoutes.routes()).use(examenContactoRoutes.allowedMethods());
app.use(controlContactoRoutes.routes()).use(controlContactoRoutes.allowedMethods());
app.use(esquemaTptRoutes.routes()).use(esquemaTptRoutes.allowedMethods());
app.use(tptIndicacionRoutes.routes()).use(tptIndicacionRoutes.allowedMethods());
app.use(tptConsentimientoRoutes.routes()).use(tptConsentimientoRoutes.allowedMethods());
app.use(tptSeguimientoRoutes.routes()).use(tptSeguimientoRoutes.allowedMethods());
app.use(reaccionAdversaRoutes.routes()).use(reaccionAdversaRoutes.allowedMethods());
app.use(visitaDomiciliariaRoutes.routes()).use(visitaDomiciliariaRoutes.allowedMethods());
app.use(derivacionTransferenciaRoutes.routes()).use(derivacionTransferenciaRoutes.allowedMethods());
app.use(alertaRoutes.routes()).use(alertaRoutes.allowedMethods());
app.use(establecimientoSaludRoutes.routes()).use(establecimientoSaludRoutes.allowedMethods());
app.use(userRoutes.routes()).use(userRoutes.allowedMethods());
app.use(roleRoutes.routes()).use(roleRoutes.allowedMethods());
app.use(auditoriaRoutes.routes()).use(auditoriaRoutes.allowedMethods());
app.use(integracionLogRoutes.routes()).use(integracionLogRoutes.allowedMethods());
app.use(integracionRoutes.routes()).use(integracionRoutes.allowedMethods());
app.use(dashboardRoutes.routes()).use(dashboardRoutes.allowedMethods());

// 404 handler
app.use(async (ctx) => {
  ctx.status = 404;
  ctx.body = {
    success: false,
    message: 'Ruta no encontrada'
  };
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;
