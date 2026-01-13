const Router = require('@koa/router');
const visitaDomiciliariaController = require('../controllers/visitaDomiciliariaController');
const { authenticate } = require('../middleware/auth');

const router = new Router({
  prefix: '/api/visitas-domiciliarias'
});

router.use(authenticate);

router.post('/', visitaDomiciliariaController.create);
router.get('/', visitaDomiciliariaController.list);
router.get('/contacto/:contactoId', visitaDomiciliariaController.getByContacto);
router.get('/caso-indice/:casoIndiceId', visitaDomiciliariaController.getByCasoIndice);
router.get('/:id', visitaDomiciliariaController.getById);
router.put('/:id', visitaDomiciliariaController.update);
router.delete('/:id', visitaDomiciliariaController.delete);

module.exports = router;
