const Router = require('@koa/router');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rateLimiter');

const router = new Router({
  prefix: '/api/auth'
});

router.post('/login', authRateLimiter, authController.login);
router.get('/me', authenticate, authController.me);

module.exports = router;
