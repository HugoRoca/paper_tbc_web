const Router = require('@koa/router');
const derivacionTransferenciaController = require('../controllers/derivacionTransferenciaController');
const { authenticate } = require('../middleware/auth');

const router = new Router({
  prefix: '/api/derivaciones-transferencias'
});

router.use(authenticate);

router.post('/', derivacionTransferenciaController.create);
router.get('/', derivacionTransferenciaController.list);
router.get('/contacto/:contactoId', derivacionTransferenciaController.getByContacto);
router.get('/establecimiento/:establecimientoId/pendientes', derivacionTransferenciaController.getPendientesByEstablecimiento);
router.get('/:id', derivacionTransferenciaController.getById);
router.put('/:id/aceptar', derivacionTransferenciaController.aceptar);
router.put('/:id/rechazar', derivacionTransferenciaController.rechazar);
router.put('/:id', derivacionTransferenciaController.update);
router.delete('/:id', derivacionTransferenciaController.delete);

module.exports = router;
