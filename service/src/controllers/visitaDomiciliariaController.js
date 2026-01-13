const visitaDomiciliariaService = require('../services/visitaDomiciliariaService');

const visitaDomiciliariaController = {
  async create(ctx) {
    try {
      const visitaData = ctx.request.body;
      const userId = ctx.state.user.id;
      const visita = await visitaDomiciliariaService.create(visitaData, userId);
      ctx.status = 201;
      ctx.body = { success: true, data: visita };
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
        caso_indice_id: ctx.query.caso_indice_id ? parseInt(ctx.query.caso_indice_id) : undefined,
        tipo_visita: ctx.query.tipo_visita,
        resultado_visita: ctx.query.resultado_visita,
        establecimiento_id: ctx.query.establecimiento_id ? parseInt(ctx.query.establecimiento_id) : undefined
      };
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
      const result = await visitaDomiciliariaService.list(page, limit, filters);
      ctx.body = { success: true, ...result };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getById(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const visita = await visitaDomiciliariaService.getById(id);
      ctx.body = { success: true, data: visita };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getByContacto(ctx) {
    try {
      const contactoId = parseInt(ctx.params.contactoId);
      const visitas = await visitaDomiciliariaService.getByContacto(contactoId);
      ctx.body = { success: true, data: visitas };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getByCasoIndice(ctx) {
    try {
      const casoIndiceId = parseInt(ctx.params.casoIndiceId);
      const visitas = await visitaDomiciliariaService.getByCasoIndice(casoIndiceId);
      ctx.body = { success: true, data: visitas };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async update(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const visitaData = ctx.request.body;
      const visita = await visitaDomiciliariaService.update(id, visitaData);
      ctx.body = { success: true, data: visita };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = { success: false, message: error.message };
    }
  },

  async delete(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      await visitaDomiciliariaService.delete(id);
      ctx.body = { success: true, message: 'Visita domiciliaria eliminada exitosamente' };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  }
};

module.exports = visitaDomiciliariaController;
