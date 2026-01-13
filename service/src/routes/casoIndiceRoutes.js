const Router = require('@koa/router');
const casoIndiceController = require('../controllers/casoIndiceController');
const { authenticate } = require('../middleware/auth');

const router = new Router({
  prefix: '/api/casos-indice'
});

router.use(authenticate);

router.post('/', casoIndiceController.create);
router.get('/', casoIndiceController.list);
router.get('/:id', casoIndiceController.getById);
router.put('/:id', casoIndiceController.update);
router.delete('/:id', casoIndiceController.delete);

module.exports = router;
