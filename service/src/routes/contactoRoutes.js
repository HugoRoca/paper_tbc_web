const Router = require('@koa/router');
const contactoController = require('../controllers/contactoController');
const { authenticate } = require('../middleware/auth');

const router = new Router({
  prefix: '/api/contactos'
});

router.use(authenticate);

router.post('/', contactoController.create);
router.get('/', contactoController.list);
router.get('/caso-indice/:casoIndiceId', contactoController.getByCasoIndice);
router.get('/:id', contactoController.getById);
router.put('/:id', contactoController.update);
router.delete('/:id', contactoController.delete);

module.exports = router;
