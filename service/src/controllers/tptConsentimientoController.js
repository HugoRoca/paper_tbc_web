const tptConsentimientoService = require('../services/tptConsentimientoService');

const tptConsentimientoController = {
  async create(ctx) {
    try {
      const consentimientoData = ctx.request.body;
      const userId = ctx.state.user.id;
      const consentimiento = await tptConsentimientoService.create(consentimientoData, userId);
      ctx.status = 201;
      ctx.body = { success: true, data: consentimiento };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getById(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const consentimiento = await tptConsentimientoService.getById(id);
      ctx.body = { success: true, data: consentimiento };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getByTptIndicacion(ctx) {
    try {
      const tptIndicacionId = parseInt(ctx.params.tptIndicacionId);
      const consentimiento = await tptConsentimientoService.getByTptIndicacion(tptIndicacionId);
      ctx.body = { success: true, data: consentimiento };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  },

  async update(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const consentimientoData = ctx.request.body;
      const consentimiento = await tptConsentimientoService.update(id, consentimientoData);
      ctx.body = { success: true, data: consentimiento };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = { success: false, message: error.message };
    }
  },

  async delete(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      await tptConsentimientoService.delete(id);
      ctx.body = { success: true, message: 'Consentimiento eliminado exitosamente' };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  }
};

module.exports = tptConsentimientoController;
