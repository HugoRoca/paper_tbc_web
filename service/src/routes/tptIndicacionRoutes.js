const Router = require('@koa/router');
const tptIndicacionController = require('../controllers/tptIndicacionController');
const { authenticate } = require('../middleware/auth');

const router = new Router({
  prefix: '/api/tpt-indicaciones'
});

router.use(authenticate);

router.post('/', tptIndicacionController.create);
router.get('/', tptIndicacionController.list);
router.get('/contacto/:contactoId', tptIndicacionController.getByContacto);
router.get('/:id', tptIndicacionController.getById);
router.put('/:id/iniciar', tptIndicacionController.iniciar);
router.put('/:id', tptIndicacionController.update);
router.delete('/:id', tptIndicacionController.delete);

module.exports = router;
