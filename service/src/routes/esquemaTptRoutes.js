const Router = require('@koa/router');
const esquemaTptController = require('../controllers/esquemaTptController');
const { authenticate } = require('../middleware/auth');

const router = new Router({
  prefix: '/api/esquemas-tpt'
});

router.use(authenticate);

router.post('/', esquemaTptController.create);
router.get('/', esquemaTptController.list);
router.get('/:id', esquemaTptController.getById);
router.put('/:id', esquemaTptController.update);
router.delete('/:id', esquemaTptController.delete);

module.exports = router;
