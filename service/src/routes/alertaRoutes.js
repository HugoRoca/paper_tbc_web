const Router = require('@koa/router');
const alertaController = require('../controllers/alertaController');
const { authenticate } = require('../middleware/auth');

const router = new Router({
  prefix: '/api/alertas'
});

router.use(authenticate);

router.post('/', alertaController.create);
router.get('/', alertaController.list);
router.get('/activas', alertaController.getActivas);
router.get('/:id', alertaController.getById);
router.put('/:id/resolver', alertaController.resolver);
router.put('/:id', alertaController.update);
router.delete('/:id', alertaController.delete);

module.exports = router;
