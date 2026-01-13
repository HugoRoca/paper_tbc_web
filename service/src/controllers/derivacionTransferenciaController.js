const derivacionTransferenciaService = require('../services/derivacionTransferenciaService');

const derivacionTransferenciaController = {
  async create(ctx) {
    try {
      const derivacionData = ctx.request.body;
      const userId = ctx.state.user.id;
      const derivacion = await derivacionTransferenciaService.create(derivacionData, userId);
      ctx.status = 201;
      ctx.body = { success: true, data: derivacion };
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
        tipo: ctx.query.tipo,
        estado: ctx.query.estado,
        establecimiento_origen_id: ctx.query.establecimiento_origen_id ? parseInt(ctx.query.establecimiento_origen_id) : undefined,
        establecimiento_destino_id: ctx.query.establecimiento_destino_id ? parseInt(ctx.query.establecimiento_destino_id) : undefined
      };
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
      const result = await derivacionTransferenciaService.list(page, limit, filters);
      ctx.body = { success: true, ...result };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getById(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const derivacion = await derivacionTransferenciaService.getById(id);
      ctx.body = { success: true, data: derivacion };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getByContacto(ctx) {
    try {
      const contactoId = parseInt(ctx.params.contactoId);
      const derivaciones = await derivacionTransferenciaService.getByContacto(contactoId);
      ctx.body = { success: true, data: derivaciones };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async getPendientesByEstablecimiento(ctx) {
    try {
      const establecimientoId = parseInt(ctx.params.establecimientoId);
      const derivaciones = await derivacionTransferenciaService.getPendientesByEstablecimiento(establecimientoId);
      ctx.body = { success: true, data: derivaciones };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: error.message };
    }
  },

  async aceptar(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const userId = ctx.state.user.id;
      const derivacion = await derivacionTransferenciaService.aceptar(id, userId);
      ctx.body = { success: true, data: derivacion };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = { success: false, message: error.message };
    }
  },

  async rechazar(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const { motivo } = ctx.request.body;
      const userId = ctx.state.user.id;
      const derivacion = await derivacionTransferenciaService.rechazar(id, motivo, userId);
      ctx.body = { success: true, data: derivacion };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = { success: false, message: error.message };
    }
  },

  async update(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const derivacionData = ctx.request.body;
      const derivacion = await derivacionTransferenciaService.update(id, derivacionData);
      ctx.body = { success: true, data: derivacion };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = { success: false, message: error.message };
    }
  },

  async delete(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      await derivacionTransferenciaService.delete(id);
      ctx.body = { success: true, message: 'Derivación/Transferencia eliminada exitosamente' };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { success: false, message: error.message };
    }
  }
};

module.exports = derivacionTransferenciaController;
