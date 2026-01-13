const Router = require('@koa/router');
const tptSeguimientoController = require('../controllers/tptSeguimientoController');
const { authenticate } = require('../middleware/auth');

const router = new Router({
  prefix: '/api/tpt-seguimiento'
});

router.use(authenticate);

router.post('/', tptSeguimientoController.create);
router.get('/', tptSeguimientoController.list);
router.get('/tpt-indicacion/:tptIndicacionId', tptSeguimientoController.getByTptIndicacion);
router.get('/:id', tptSeguimientoController.getById);
router.put('/:id', tptSeguimientoController.update);
router.delete('/:id', tptSeguimientoController.delete);

module.exports = router;
