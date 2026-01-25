const Router = require('@koa/router');
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

const router = new Router({
  prefix: '/api/dashboard'
});

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/stats', dashboardController.getStats);
router.get('/casos-por-tipo', dashboardController.getCasosPorTipo);
router.get('/casos-por-mes', dashboardController.getCasosPorMes);
router.get('/contactos-por-tipo', dashboardController.getContactosPorTipo);
router.get('/tpt-por-estado', dashboardController.getTptPorEstado);
router.get('/controles-por-estado', dashboardController.getControlesPorEstado);
router.get('/alertas-por-severidad', dashboardController.getAlertasPorSeveridad);

module.exports = router;
