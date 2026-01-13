const tptIndicacionService = require('../services/tptIndicacionService');

const tptIndicacionController = {
  async create(ctx) {
    try {
      const indicacionData = ctx.request.body;
      const userId = ctx.state.user.id;
      const indicacion = await tptIndicacionService.create(indicacionData, userId);
      ctx.status = 201;
      ctx.body = { success: true, data: indicacion };
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
        contacto_id: ctx.query.contacto_id ? parseInt(ctx.query.contacto_id) : undefined,
        estado: ctx.query.estado,
        establecimiento_id: ctx.query.establecimiento_id ? parseInt(ctx.query.establecimiento_id) : undefined
      };
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
      const result = await tptIndicacionService.list(page, limit, filters);
      ctx.body = { success: true, ...result };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getById(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const indicacion = await tptIndicacionService.getById(id);
      ctx.body = { success: true, data: indicacion };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getByContacto(ctx) {
    try {
      const contactoId = parseInt(ctx.params.contactoId);
      const indicaciones = await tptIndicacionService.getByContacto(contactoId);
      ctx.body = { success: true, data: indicaciones };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async iniciar(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const { fecha_inicio } = ctx.request.body;
      const indicacion = await tptIndicacionService.iniciar(id, fecha_inicio);
      ctx.body = { success: true, data: indicacion };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = { success: false, message: error.message };
    }
  },

  async update(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const indicacionData = ctx.request.body;
      const indicacion = await tptIndicacionService.update(id, indicacionData);
      ctx.body = { success: true, data: indicacion };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = { success: false, message: error.message };
    }
  },

  async delete(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      await tptIndicacionService.delete(id);
      ctx.body = { success: true, message: 'Indicación TPT eliminada exitosamente' };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  }
};

module.exports = tptIndicacionController;
