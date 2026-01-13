const Router = require('@koa/router');
const auditoriaController = require('../controllers/auditoriaController');
const { authenticate, authorize } = require('../middleware/auth');

const router = new Router({
  prefix: '/api/auditoria'
});

// Todas las rutas requieren autenticación
router.use(authenticate);

// Solo administradores pueden ver auditoría
router.get('/', authorize('Administrador'), auditoriaController.list);
router.get('/:id', authorize('Administrador'), auditoriaController.getById);
router.get('/usuario/:usuarioId', authorize('Administrador'), auditoriaController.getByUsuario);
router.get('/tabla/:tabla', authorize('Administrador'), auditoriaController.getByTabla);

module.exports = router;
