const tptSeguimientoService = require('../services/tptSeguimientoService');

const tptSeguimientoController = {
  async create(ctx) {
    try {
      const seguimientoData = ctx.request.body;
      const userId = ctx.state.user.id;
      const seguimiento = await tptSeguimientoService.create(seguimientoData, userId);
      ctx.status = 201;
      ctx.body = { success: true, data: seguimiento };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = { success: false, message: error.message };
    }
  },

  async list(ctx) {
    try {
      const page = parseInt(ctx.query.page) || 1;
      const limit = parseInt(ctx.query.limit) || 10;
      const filters = {
        tpt_indicacion_id: ctx.query.tpt_indicacion_id ? parseInt(ctx.query.tpt_indicacion_id) : undefined,
        establecimiento_id: ctx.query.establecimiento_id ? parseInt(ctx.query.establecimiento_id) : undefined
      };
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
      const result = await tptSeguimientoService.list(page, limit, filters);
      ctx.body = { success: true, ...result };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getById(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const seguimiento = await tptSeguimientoService.getById(id);
      ctx.body = { success: true, data: seguimiento };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getByTptIndicacion(ctx) {
    try {
      const tptIndicacionId = parseInt(ctx.params.tptIndicacionId);
      const seguimientos = await tptSeguimientoService.getByTptIndicacion(tptIndicacionId);
      ctx.body = { success: true, data: seguimientos };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async update(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const seguimientoData = ctx.request.body;
      const seguimiento = await tptSeguimientoService.update(id, seguimientoData);
      ctx.body = { success: true, data: seguimiento };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = { success: false, message: error.message };
    }
  },

  async delete(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      await tptSeguimientoService.delete(id);
      ctx.body = { success: true, message: 'Seguimiento eliminado exitosamente' };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  }
};

module.exports = tptSeguimientoController;
