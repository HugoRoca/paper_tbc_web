const establecimientoSaludService = require('../services/establecimientoSaludService');

const establecimientoSaludController = {
  async create(ctx) {
    try {
      const establecimientoData = ctx.request.body;
      const establecimiento = await establecimientoSaludService.create(establecimientoData);
      ctx.status = 201;
      ctx.body = { success: true, data: establecimiento };
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
        tipo: ctx.query.tipo,
        departamento: ctx.query.departamento,
        provincia: ctx.query.provincia,
        distrito: ctx.query.distrito,
        nombre: ctx.query.nombre
      };
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
      const result = await establecimientoSaludService.list(page, limit, filters);
      ctx.body = { success: true, ...result };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getById(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const establecimiento = await establecimientoSaludService.getById(id);
      ctx.body = { success: true, data: establecimiento };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  },

  async update(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const establecimientoData = ctx.request.body;
      const establecimiento = await establecimientoSaludService.update(id, establecimientoData);
      ctx.body = { success: true, data: establecimiento };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = { success: false, message: error.message };
    }
  },

  async delete(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      await establecimientoSaludService.delete(id);
      ctx.body = { success: true, message: 'Establecimiento eliminado exitosamente' };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  }
};

module.exports = establecimientoSaludController;
