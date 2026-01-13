const Router = require('@koa/router');
const examenContactoController = require('../controllers/examenContactoController');
const { authenticate } = require('../middleware/auth');

const router = new Router({
  prefix: '/api/examenes-contacto'
});

router.use(authenticate);

router.post('/', examenContactoController.create);
router.get('/', examenContactoController.list);
router.get('/contacto/:contactoId', examenContactoController.getByContacto);
router.get('/:id', examenContactoController.getById);
router.put('/:id', examenContactoController.update);
router.delete('/:id', examenContactoController.delete);

module.exports = router;
