const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const helmet = require('koa-helmet');
const json = require('koa-json');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const auditLog = require('./middleware/audit');

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

// Swagger
const swaggerSpec = require('./config/swagger');
const { koaSwagger } = require('koa2-swagger-ui');

const app = new Koa();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(logger());
app.use(json());
app.use(bodyParser({
  jsonLimit: '10mb',
  formLimit: '10mb'
}));

// Error handler
app.use(errorHandler);

// Swagger documentation
app.use(
  koaSwagger({
    routePrefix: '/api-docs',
    swaggerOptions: {
      spec: swaggerSpec
    },
    hideTopbar: true
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
