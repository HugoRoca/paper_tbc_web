const esquemaTptService = require('../services/esquemaTptService');

const esquemaTptController = {
  async create(ctx) {
    try {
      const esquemaData = ctx.request.body;
      const esquema = await esquemaTptService.create(esquemaData);
      ctx.status = 201;
      ctx.body = { success: true, data: esquema };
    } catch (error) {
      ctx.status = 400;
      ctx.body = { success: false, message: error.message };
    }
  },

  async list(ctx) {
    try {
      const page = parseInt(ctx.query.page) || 1;
      const limit = parseInt(ctx.query.limit) || 10;
      const filters = {
        activo: ctx.query.activo !== undefined ? ctx.query.activo === 'true' : undefined
      };
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
      const result = await esquemaTptService.list(page, limit, filters);
      ctx.body = { success: true, ...result };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getById(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const esquema = await esquemaTptService.getById(id);
      ctx.body = { success: true, data: esquema };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  },

  async update(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const esquemaData = ctx.request.body;
      const esquema = await esquemaTptService.update(id, esquemaData);
      ctx.body = { success: true, data: esquema };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = { success: false, message: error.message };
    }
  },

  async delete(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      await esquemaTptService.delete(id);
      ctx.body = { success: true, message: 'Esquema TPT eliminado exitosamente' };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  }
};

module.exports = esquemaTptController;
