const Router = require('@koa/router');
const integracionLogController = require('../controllers/integracionLogController');
const { authenticate, authorize } = require('../middleware/auth');

const router = new Router({
  prefix: '/api/integraciones-log'
});

// Todas las rutas requieren autenticación
router.use(authenticate);

// Solo administradores pueden ver logs de integraciones
router.get('/', authorize('Administrador'), integracionLogController.list);
router.get('/:id', authorize('Administrador'), integracionLogController.getById);
router.get('/sistema/:sistema', authorize('Administrador'), integracionLogController.getBySistema);

module.exports = router;
