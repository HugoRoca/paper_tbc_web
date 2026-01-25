const dashboardService = require('../services/dashboardService');

const dashboardController = {
  /**
   * @swagger
   * /api/dashboard/stats:
   *   get:
   *     summary: Obtener estadísticas generales del dashboard
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Estadísticas generales
   */
  async getStats(ctx) {
    try {
      const stats = await dashboardService.getStats();
      ctx.body = {
        success: true,
        data: stats
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
   * /api/dashboard/casos-por-tipo:
   *   get:
   *     summary: Distribución de casos por tipo de TB
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Distribución de casos por tipo
   */
  async getCasosPorTipo(ctx) {
    try {
      const data = await dashboardService.getCasosPorTipo();
      ctx.body = {
        success: true,
        data
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
   * /api/dashboard/casos-por-mes:
   *   get:
   *     summary: Casos índice registrados por mes
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: meses
   *         schema:
   *           type: integer
   *           default: 6
   *         description: Número de meses a consultar
   *     responses:
   *       200:
   *         description: Casos por mes
   */
  async getCasosPorMes(ctx) {
    try {
      const meses = parseInt(ctx.query.meses) || 6;
      const data = await dashboardService.getCasosPorMes(meses);
      ctx.body = {
        success: true,
        data
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
   * /api/dashboard/contactos-por-tipo:
   *   get:
   *     summary: Distribución de contactos por tipo
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Distribución de contactos por tipo
   */
  async getContactosPorTipo(ctx) {
    try {
      const data = await dashboardService.getContactosPorTipo();
      ctx.body = {
        success: true,
        data
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
   * /api/dashboard/tpt-por-estado:
   *   get:
   *     summary: Distribución de TPT por estado
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Distribución de TPT por estado
   */
  async getTptPorEstado(ctx) {
    try {
      const data = await dashboardService.getTptPorEstado();
      ctx.body = {
        success: true,
        data
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
   * /api/dashboard/controles-por-estado:
   *   get:
   *     summary: Distribución de controles por estado
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Distribución de controles por estado
   */
  async getControlesPorEstado(ctx) {
    try {
      const data = await dashboardService.getControlesPorEstado();
      ctx.body = {
        success: true,
        data
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
   * /api/dashboard/alertas-por-severidad:
   *   get:
   *     summary: Distribución de alertas por severidad
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Distribución de alertas por severidad
   */
  async getAlertasPorSeveridad(ctx) {
    try {
      const data = await dashboardService.getAlertasPorSeveridad();
      ctx.body = {
        success: true,
        data
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

module.exports = dashboardController;
