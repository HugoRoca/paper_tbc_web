const userService = require('../services/userService');

const userController = {
  /**
   * @swagger
   * /api/usuarios:
   *   get:
   *     summary: Listar usuarios
   *     tags: [Usuarios]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *       - in: query
   *         name: activo
   *         schema:
   *           type: boolean
   *       - in: query
   *         name: rol_id
   *         schema:
   *           type: integer
   *       - in: query
   *         name: establecimiento_id
   *         schema:
   *           type: integer
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lista de usuarios
   */
  async list(ctx) {
    try {
      const page = parseInt(ctx.query.page) || 1;
      const limit = parseInt(ctx.query.limit) || 10;
      const filters = {
        activo: ctx.query.activo !== undefined ? ctx.query.activo === 'true' : undefined,
        rol_id: ctx.query.rol_id ? parseInt(ctx.query.rol_id) : undefined,
        establecimiento_id: ctx.query.establecimiento_id ? parseInt(ctx.query.establecimiento_id) : undefined,
        search: ctx.query.search
      };

      const result = await userService.list(page, limit, filters);
      ctx.body = {
        success: true,
        data: result.data,
        pagination: result.pagination
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  },

  /**
   * @swagger
   * /api/usuarios:
   *   post:
   *     summary: Crear usuario
   *     tags: [Usuarios]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *               - nombres
   *               - apellidos
   *               - rol_id
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               nombres:
   *                 type: string
   *               apellidos:
   *                 type: string
   *               dni:
   *                 type: string
   *               rol_id:
   *                 type: integer
   *               establecimiento_id:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Usuario creado
   */
  async create(ctx) {
    try {
      const userData = ctx.request.body;
      const user = await userService.create(userData);
      ctx.status = 201;
      ctx.body = {
        success: true,
        data: user,
        message: 'Usuario creado correctamente'
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  },

  /**
   * @swagger
   * /api/usuarios/{id}:
   *   get:
   *     summary: Obtener usuario por ID
   *     tags: [Usuarios]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Usuario encontrado
   */
  async getById(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const user = await userService.getById(id);
      ctx.body = {
        success: true,
        data: user
      };
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  },

  /**
   * @swagger
   * /api/usuarios/{id}:
   *   put:
   *     summary: Actualizar usuario
   *     tags: [Usuarios]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nombres:
   *                 type: string
   *               apellidos:
   *                 type: string
   *               email:
   *                 type: string
   *               dni:
   *                 type: string
   *               rol_id:
   *                 type: integer
   *               establecimiento_id:
   *                 type: integer
   *               activo:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Usuario actualizado
   */
  async update(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const userData = ctx.request.body;
      const user = await userService.update(id, userData);
      ctx.body = {
        success: true,
        data: user,
        message: 'Usuario actualizado correctamente'
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  },

  /**
   * @swagger
   * /api/usuarios/{id}/cambiar-password:
   *   put:
   *     summary: Cambiar contraseña de usuario
   *     tags: [Usuarios]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - currentPassword
   *               - newPassword
   *             properties:
   *               currentPassword:
   *                 type: string
   *               newPassword:
   *                 type: string
   *     responses:
   *       200:
   *         description: Contraseña actualizada
   */
  async changePassword(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const { currentPassword, newPassword } = ctx.request.body;

      if (!currentPassword || !newPassword) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Contraseña actual y nueva contraseña son requeridas'
        };
        return;
      }

      const result = await userService.changePassword(id, currentPassword, newPassword);
      ctx.body = {
        success: true,
        message: result.message
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  },

  /**
   * @swagger
   * /api/usuarios/{id}:
   *   delete:
   *     summary: Eliminar usuario (soft delete)
   *     tags: [Usuarios]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Usuario eliminado
   */
  async delete(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      await userService.delete(id);
      ctx.body = {
        success: true,
        message: 'Usuario eliminado correctamente'
      };
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }
};

module.exports = userController;
