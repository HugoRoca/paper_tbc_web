const Router = require('@koa/router');
const integracionController = require('../controllers/integracionController');
const { authenticate, authorize } = require('../middleware/auth');

const router = new Router({
  prefix: '/api/integraciones'
});

// Todas las rutas requieren autenticación
router.use(authenticate);

// Endpoints de integración con sistemas externos
router.post('/sigtb/consultar', authorize('Administrador', 'Médico'), integracionController.consultarSIGTB);
router.post('/netlab/consultar', authorize('Administrador', 'Médico'), integracionController.consultarNETLAB);

module.exports = router;
