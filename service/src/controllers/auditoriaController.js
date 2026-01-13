const auditoriaService = require('../services/auditoriaService');

const auditoriaController = {
  /**
   * @swagger
   * /api/auditoria:
   *   get:
   *     summary: Listar registros de auditoría
   *     tags: [Auditoría]
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
   *           default: 50
   *       - in: query
   *         name: usuario_id
   *         schema:
   *           type: integer
   *       - in: query
   *         name: tabla_afectada
   *         schema:
   *           type: string
   *       - in: query
   *         name: accion
   *         schema:
   *           type: string
   *           enum: [INSERT, UPDATE, DELETE, SELECT, LOGIN, LOGOUT]
   *       - in: query
   *         name: fecha_desde
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: fecha_hasta
   *         schema:
   *           type: string
   *           format: date
   *     responses:
   *       200:
   *         description: Lista de registros de auditoría
   */
  async list(ctx) {
    try {
      const page = parseInt(ctx.query.page) || 1;
      const limit = parseInt(ctx.query.limit) || 50;
      const filters = {
        usuario_id: ctx.query.usuario_id ? parseInt(ctx.query.usuario_id) : undefined,
        tabla_afectada: ctx.query.tabla_afectada,
        accion: ctx.query.accion,
        fecha_desde: ctx.query.fecha_desde,
        fecha_hasta: ctx.query.fecha_hasta
      };
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

      const result = await auditoriaService.list(page, limit, filters);
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
   * /api/auditoria/{id}:
   *   get:
   *     summary: Obtener registro de auditoría por ID
   *     tags: [Auditoría]
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
   *         description: Registro de auditoría encontrado
   */
  async getById(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const auditoria = await auditoriaService.getById(id);
      ctx.body = {
        success: true,
        data: auditoria
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
   * /api/auditoria/usuario/{usuarioId}:
   *   get:
   *     summary: Listar auditoría por usuario
   *     tags: [Auditoría]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: usuarioId
   *         required: true
   *         schema:
   *           type: integer
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 50
   *     responses:
   *       200:
   *         description: Lista de registros de auditoría del usuario
   */
  async getByUsuario(ctx) {
    try {
      const usuarioId = parseInt(ctx.params.usuarioId);
      const page = parseInt(ctx.query.page) || 1;
      const limit = parseInt(ctx.query.limit) || 50;
      const result = await auditoriaService.getByUsuario(usuarioId, page, limit);
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
   * /api/auditoria/tabla/{tabla}:
   *   get:
   *     summary: Listar auditoría por tabla
   *     tags: [Auditoría]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: tabla
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 50
   *     responses:
   *       200:
   *         description: Lista de registros de auditoría de la tabla
   */
  async getByTabla(ctx) {
    try {
      const tabla = ctx.params.tabla;
      const page = parseInt(ctx.query.page) || 1;
      const limit = parseInt(ctx.query.limit) || 50;
      const result = await auditoriaService.getByTabla(tabla, page, limit);
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
  }
};

module.exports = auditoriaController;
