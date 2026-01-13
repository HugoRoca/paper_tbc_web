const integracionService = require('../services/integracionService');

const integracionController = {
  /**
   * @swagger
   * /api/integraciones/sigtb/consultar:
   *   post:
   *     summary: Consultar SIGTB
   *     tags: [Integraciones]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               dni:
   *                 type: string
   *               codigo_caso:
   *                 type: string
   *               fecha_desde:
   *                 type: string
   *                 format: date
   *               fecha_hasta:
   *                 type: string
   *                 format: date
   *     responses:
   *       200:
   *         description: Consulta exitosa
   *       400:
   *         description: Error en la consulta
   */
  async consultarSIGTB(ctx) {
    try {
      const params = ctx.request.body;
      const userId = ctx.state.user.id;

      const result = await integracionService.consultarSIGTB(params, userId);
      ctx.body = {
        success: true,
        data: result.data,
        logId: result.logId,
        message: 'Consulta a SIGTB realizada correctamente'
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
   * /api/integraciones/netlab/consultar:
   *   post:
   *     summary: Consultar NETLAB
   *     tags: [Integraciones]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               codigo_muestra:
   *                 type: string
   *               dni:
   *                 type: string
   *               fecha_desde:
   *                 type: string
   *                 format: date
   *               fecha_hasta:
   *                 type: string
   *                 format: date
   *     responses:
   *       200:
   *         description: Consulta exitosa
   *       400:
   *         description: Error en la consulta
   */
  async consultarNETLAB(ctx) {
    try {
      const params = ctx.request.body;
      const userId = ctx.state.user.id;

      const result = await integracionService.consultarNETLAB(params, userId);
      ctx.body = {
        success: true,
        data: result.data,
        logId: result.logId,
        message: 'Consulta a NETLAB realizada correctamente'
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

module.exports = integracionController;
