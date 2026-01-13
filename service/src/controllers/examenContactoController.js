const examenContactoService = require('../services/examenContactoService');

const examenContactoController = {
  async create(ctx) {
    try {
      const examenData = ctx.request.body;
      const userId = ctx.state.user.id;
      const examen = await examenContactoService.create(examenData, userId);
      ctx.status = 201;
      ctx.body = { success: true, data: examen };
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
        tipo_examen: ctx.query.tipo_examen,
        establecimiento_id: ctx.query.establecimiento_id ? parseInt(ctx.query.establecimiento_id) : undefined,
        fecha_desde: ctx.query.fecha_desde,
        fecha_hasta: ctx.query.fecha_hasta
      };
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
      const result = await examenContactoService.list(page, limit, filters);
      ctx.body = { success: true, ...result };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getById(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const examen = await examenContactoService.getById(id);
      ctx.body = { success: true, data: examen };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getByContacto(ctx) {
    try {
      const contactoId = parseInt(ctx.params.contactoId);
      const examenes = await examenContactoService.getByContacto(contactoId);
      ctx.body = { success: true, data: examenes };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async update(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const examenData = ctx.request.body;
      const examen = await examenContactoService.update(id, examenData);
      ctx.body = { success: true, data: examen };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = { success: false, message: error.message };
    }
  },

  async delete(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      await examenContactoService.delete(id);
      ctx.body = { success: true, message: 'Examen eliminado exitosamente' };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  }
};

module.exports = examenContactoController;
