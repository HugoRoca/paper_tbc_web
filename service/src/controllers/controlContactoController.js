const controlContactoService = require('../services/controlContactoService');

const controlContactoController = {
  async create(ctx) {
    try {
      const controlData = ctx.request.body;
      const userId = ctx.state.user.id;
      const control = await controlContactoService.create(controlData, userId);
      ctx.status = 201;
      ctx.body = { success: true, data: control };
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
      const result = await controlContactoService.list(page, limit, filters);
      ctx.body = { success: true, ...result };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getById(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const control = await controlContactoService.getById(id);
      ctx.body = { success: true, data: control };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getByContacto(ctx) {
    try {
      const contactoId = parseInt(ctx.params.contactoId);
      const controles = await controlContactoService.getByContacto(contactoId);
      ctx.body = { success: true, data: controles };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async marcarRealizado(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const { resultado } = ctx.request.body;
      const userId = ctx.state.user.id;
      const control = await controlContactoService.marcarRealizado(id, resultado, userId);
      ctx.body = { success: true, data: control };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = { success: false, message: error.message };
    }
  },

  async update(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const controlData = ctx.request.body;
      const control = await controlContactoService.update(id, controlData);
      ctx.body = { success: true, data: control };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = { success: false, message: error.message };
    }
  },

  async delete(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      await controlContactoService.delete(id);
      ctx.body = { success: true, message: 'Control eliminado exitosamente' };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  }
};

module.exports = controlContactoController;
