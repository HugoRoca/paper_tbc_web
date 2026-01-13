const Router = require('@koa/router');
const establecimientoSaludController = require('../controllers/establecimientoSaludController');
const { authenticate } = require('../middleware/auth');

const router = new Router({
  prefix: '/api/establecimientos-salud'
});

router.use(authenticate);

router.post('/', establecimientoSaludController.create);
router.get('/', establecimientoSaludController.list);
router.get('/:id', establecimientoSaludController.getById);
router.put('/:id', establecimientoSaludController.update);
router.delete('/:id', establecimientoSaludController.delete);

module.exports = router;
