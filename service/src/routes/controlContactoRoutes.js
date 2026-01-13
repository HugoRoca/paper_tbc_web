const Router = require('@koa/router');
const controlContactoController = require('../controllers/controlContactoController');
const { authenticate } = require('../middleware/auth');

const router = new Router({
  prefix: '/api/controles-contacto'
});

router.use(authenticate);

router.post('/', controlContactoController.create);
router.get('/', controlContactoController.list);
router.get('/contacto/:contactoId', controlContactoController.getByContacto);
router.get('/:id', controlContactoController.getById);
router.put('/:id/realizar', controlContactoController.marcarRealizado);
router.put('/:id', controlContactoController.update);
router.delete('/:id', controlContactoController.delete);

module.exports = router;
