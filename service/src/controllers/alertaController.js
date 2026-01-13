const alertaService = require('../services/alertaService');

const alertaController = {
  async create(ctx) {
    try {
      const alertaData = ctx.request.body;
      const alerta = await alertaService.create(alertaData);
      ctx.status = 201;
      ctx.body = { success: true, data: alerta };
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
        contacto_id: ctx.query.contacto_id ? parseInt(ctx.query.contacto_id) : undefined,
        caso_indice_id: ctx.query.caso_indice_id ? parseInt(ctx.query.caso_indice_id) : undefined,
        tipo_alerta: ctx.query.tipo_alerta,
        estado: ctx.query.estado,
        severidad: ctx.query.severidad
      };
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
      const result = await alertaService.list(page, limit, filters);
      ctx.body = { success: true, ...result };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getActivas(ctx) {
    try {
      const filters = {
        contacto_id: ctx.query.contacto_id ? parseInt(ctx.query.contacto_id) : undefined,
        caso_indice_id: ctx.query.caso_indice_id ? parseInt(ctx.query.caso_indice_id) : undefined,
        tipo_alerta: ctx.query.tipo_alerta,
        severidad: ctx.query.severidad
      };
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
      const alertas = await alertaService.getActivas(filters);
      ctx.body = { success: true, data: alertas };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getById(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const alerta = await alertaService.getById(id);
      ctx.body = { success: true, data: alerta };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  },

  async resolver(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const { observaciones } = ctx.request.body;
      const userId = ctx.state.user.id;
      const alerta = await alertaService.resolver(id, userId, observaciones);
      ctx.body = { success: true, data: alerta };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = { success: false, message: error.message };
    }
  },

  async update(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const alertaData = ctx.request.body;
      const alerta = await alertaService.update(id, alertaData);
      ctx.body = { success: true, data: alerta };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = { success: false, message: error.message };
    }
  },

  async delete(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      await alertaService.delete(id);
      ctx.body = { success: true, message: 'Alerta eliminada exitosamente' };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  }
};

module.exports = alertaController;
