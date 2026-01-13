const alertaRepository = require('../repositories/alertaRepository');

const alertaService = {
  /**
   * Crear nueva alerta
   */
  async create(alertaData) {
    return await alertaRepository.create(alertaData);
  },

  /**
   * Obtener alerta por ID
   */
  async getById(id) {
    const alerta = await alertaRepository.findById(id);
    if (!alerta) {
      throw new Error('Alerta no encontrada');
    }
    return alerta;
  },

  /**
   * Listar alertas activas
   */
  async getActivas(filters = {}) {
    return await alertaRepository.findActivas(filters);
  },

  /**
   * Listar alertas
   */
  async list(page = 1, limit = 10, filters = {}) {
    return await alertaRepository.findAll(page, limit, filters);
  },

  /**
   * Resolver alerta
   */
  async resolver(id, usuarioId, observaciones) {
    const alerta = await alertaRepository.findById(id);
    if (!alerta) {
      throw new Error('Alerta no encontrada');
    }

    if (alerta.estado === 'Resuelta') {
      throw new Error('La alerta ya está resuelta');
    }

    return await alertaRepository.resolver(id, usuarioId, observaciones);
  },

  /**
   * Actualizar alerta
   */
  async update(id, alertaData) {
    const alerta = await alertaRepository.findById(id);
    if (!alerta) {
      throw new Error('Alerta no encontrada');
    }

    return await alertaRepository.update(id, alertaData);
  },

  /**
   * Eliminar alerta
   */
  async delete(id) {
    const alerta = await alertaRepository.findById(id);
    if (!alerta) {
      throw new Error('Alerta no encontrada');
    }
    return await alertaRepository.delete(id);
  }
};

module.exports = alertaService;
