const roleService = require('../services/roleService');

const roleController = {
  /**
   * @swagger
   * /api/roles:
   *   get:
   *     summary: Listar roles
   *     tags: [Roles]
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
   *         name: search
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lista de roles
   */
  async list(ctx) {
    try {
      const page = parseInt(ctx.query.page) || 1;
      const limit = parseInt(ctx.query.limit) || 10;
      const filters = {
        activo: ctx.query.activo !== undefined ? ctx.query.activo === 'true' : undefined,
        search: ctx.query.search
      };

      const result = await roleService.list(page, limit, filters);
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
   * /api/roles:
   *   post:
   *     summary: Crear rol
   *     tags: [Roles]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nombre
   *             properties:
   *               nombre:
   *                 type: string
   *               descripcion:
   *                 type: string
   *     responses:
   *       201:
   *         description: Rol creado
   */
  async create(ctx) {
    try {
      const roleData = ctx.request.body;
      const role = await roleService.create(roleData);
      ctx.status = 201;
      ctx.body = {
        success: true,
        data: role,
        message: 'Rol creado correctamente'
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
   * /api/roles/{id}:
   *   get:
   *     summary: Obtener rol por ID
   *     tags: [Roles]
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
   *         description: Rol encontrado
   */
  async getById(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const role = await roleService.getById(id);
      ctx.body = {
        success: true,
        data: role
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
   * /api/roles/{id}:
   *   put:
   *     summary: Actualizar rol
   *     tags: [Roles]
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
   *               nombre:
   *                 type: string
   *               descripcion:
   *                 type: string
   *               activo:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Rol actualizado
   */
  async update(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const roleData = ctx.request.body;
      const role = await roleService.update(id, roleData);
      ctx.body = {
        success: true,
        data: role,
        message: 'Rol actualizado correctamente'
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
   * /api/roles/{id}:
   *   delete:
   *     summary: Eliminar rol (soft delete)
   *     tags: [Roles]
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
   *         description: Rol eliminado
   */
  async delete(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      await roleService.delete(id);
      ctx.body = {
        success: true,
        message: 'Rol eliminado correctamente'
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

module.exports = roleController;
