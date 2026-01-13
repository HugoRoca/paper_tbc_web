const Router = require('@koa/router');
const roleController = require('../controllers/roleController');
const { authenticate, authorize } = require('../middleware/auth');

const router = new Router({
  prefix: '/api/roles'
});

// Todas las rutas requieren autenticación
router.use(authenticate);

// Solo administradores pueden gestionar roles
router.get('/', roleController.list); // Todos pueden ver roles
router.post('/', authorize('Administrador'), roleController.create);
router.get('/:id', roleController.getById); // Todos pueden ver un rol
router.put('/:id', authorize('Administrador'), roleController.update);
router.delete('/:id', authorize('Administrador'), roleController.delete);

module.exports = router;
