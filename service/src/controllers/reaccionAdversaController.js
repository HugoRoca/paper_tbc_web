const reaccionAdversaService = require('../services/reaccionAdversaService');

const reaccionAdversaController = {
  async create(ctx) {
    try {
      const reaccionData = ctx.request.body;
      const userId = ctx.state.user.id;
      const reaccion = await reaccionAdversaService.create(reaccionData, userId);
      ctx.status = 201;
      ctx.body = { success: true, data: reaccion };
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
        severidad: ctx.query.severidad,
        resultado: ctx.query.resultado,
        establecimiento_id: ctx.query.establecimiento_id ? parseInt(ctx.query.establecimiento_id) : undefined
      };
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
      const result = await reaccionAdversaService.list(page, limit, filters);
      ctx.body = { success: true, ...result };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getById(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const reaccion = await reaccionAdversaService.getById(id);
      ctx.body = { success: true, data: reaccion };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getByTptIndicacion(ctx) {
    try {
      const tptIndicacionId = parseInt(ctx.params.tptIndicacionId);
      const reacciones = await reaccionAdversaService.getByTptIndicacion(tptIndicacionId);
      ctx.body = { success: true, data: reacciones };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async update(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const reaccionData = ctx.request.body;
      const reaccion = await reaccionAdversaService.update(id, reaccionData);
      ctx.body = { success: true, data: reaccion };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = { success: false, message: error.message };
    }
  },

  async delete(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      await reaccionAdversaService.delete(id);
      ctx.body = { success: true, message: 'Reacción adversa eliminada exitosamente' };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  }
};

module.exports = reaccionAdversaController;
