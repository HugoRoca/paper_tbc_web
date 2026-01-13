const Router = require('@koa/router');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

const router = new Router({
  prefix: '/api/usuarios'
});

// Todas las rutas requieren autenticación
router.use(authenticate);

// Solo administradores pueden gestionar usuarios
router.get('/', authorize('Administrador'), userController.list);
router.post('/', authorize('Administrador'), userController.create);
router.get('/:id', authorize('Administrador'), userController.getById);
router.put('/:id', authorize('Administrador'), userController.update);
router.put('/:id/cambiar-password', userController.changePassword); // El usuario puede cambiar su propia contraseña
router.delete('/:id', authorize('Administrador'), userController.delete);

module.exports = router;
