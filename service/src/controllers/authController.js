const authService = require('../services/authService');

const authController = {
  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Autenticar usuario
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login exitoso
   *       401:
   *         description: Credenciales inválidas
   */
  async login(ctx) {
    const { email, password } = ctx.request.body;

    if (!email || !password) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Email y contraseña son requeridos'
      };
      return;
    }

    try {
      const result = await authService.login(email, password);
      ctx.body = {
        success: true,
        data: result
      };
    } catch (error) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  },

  /**
   * @swagger
   * /api/auth/me:
   *   get:
   *     summary: Obtener información del usuario autenticado
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Información del usuario
   */
  async me(ctx) {
    ctx.body = {
      success: true,
      data: {
        user: ctx.state.user
      }
    };
  }
};

module.exports = authController;
