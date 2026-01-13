const Router = require('@koa/router');
const reaccionAdversaController = require('../controllers/reaccionAdversaController');
const { authenticate } = require('../middleware/auth');

const router = new Router({
  prefix: '/api/reacciones-adversas'
});

router.use(authenticate);

router.post('/', reaccionAdversaController.create);
router.get('/', reaccionAdversaController.list);
router.get('/tpt-indicacion/:tptIndicacionId', reaccionAdversaController.getByTptIndicacion);
router.get('/:id', reaccionAdversaController.getById);
router.put('/:id', reaccionAdversaController.update);
router.delete('/:id', reaccionAdversaController.delete);

module.exports = router;
