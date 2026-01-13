const Router = require('@koa/router');
const tptConsentimientoController = require('../controllers/tptConsentimientoController');
const { authenticate } = require('../middleware/auth');

const router = new Router({
  prefix: '/api/tpt-consentimientos'
});

router.use(authenticate);

router.post('/', tptConsentimientoController.create);
router.get('/tpt-indicacion/:tptIndicacionId', tptConsentimientoController.getByTptIndicacion);
router.get('/:id', tptConsentimientoController.getById);
router.put('/:id', tptConsentimientoController.update);
router.delete('/:id', tptConsentimientoController.delete);

module.exports = router;
