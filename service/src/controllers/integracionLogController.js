const integracionLogService = require('../services/integracionLogService');

const integracionLogController = {
  /**
   * @swagger
   * /api/integraciones-log:
   *   get:
   *     summary: Listar logs de integraciones
   *     tags: [Integraciones]
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
   *         name: sistema_externo
   *         schema:
   *           type: string
   *           enum: [SIGTB, NETLAB, Otro]
   *       - in: query
   *         name: tipo_operacion
   *         schema:
   *           type: string
   *           enum: [Consulta, Envío, Recepción, Sincronización]
   *       - in: query
   *         name: estado
   *         schema:
   *           type: string
   *           enum: [Exitoso, Error, Pendiente]
   *       - in: query
   *         name: usuario_id
   *         schema:
   *           type: integer
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
   *         description: Lista de logs de integraciones
   */
  async list(ctx) {
    try {
      const page = parseInt(ctx.query.page) || 1;
      const limit = parseInt(ctx.query.limit) || 50;
      const filters = {
        sistema_externo: ctx.query.sistema_externo,
        tipo_operacion: ctx.query.tipo_operacion,
        estado: ctx.query.estado,
        usuario_id: ctx.query.usuario_id ? parseInt(ctx.query.usuario_id) : undefined,
        fecha_desde: ctx.query.fecha_desde,
        fecha_hasta: ctx.query.fecha_hasta
      };
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

      const result = await integracionLogService.list(page, limit, filters);
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
   * /api/integraciones-log/{id}:
   *   get:
   *     summary: Obtener log de integración por ID
   *     tags: [Integraciones]
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
   *         description: Log de integración encontrado
   */
  async getById(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const log = await integracionLogService.getById(id);
      ctx.body = {
        success: true,
        data: log
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
   * /api/integraciones-log/sistema/{sistema}:
   *   get:
   *     summary: Listar logs por sistema externo
   *     tags: [Integraciones]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: sistema
   *         required: true
   *         schema:
   *           type: string
   *           enum: [SIGTB, NETLAB, Otro]
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
   *         description: Lista de logs del sistema
   */
  async getBySistema(ctx) {
    try {
      const sistema = ctx.params.sistema;
      const page = parseInt(ctx.query.page) || 1;
      const limit = parseInt(ctx.query.limit) || 50;
      const result = await integracionLogService.getBySistema(sistema, page, limit);
      ctx.body = {
        success: true,
        data: result.data,
        pagination: result.pagination
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }
};

module.exports = integracionLogController;
