const integracionLogRepository = require('../repositories/integracionLogRepository');

const integracionLogService = {
  /**
   * Obtener log de integración por ID
   */
  async getById(id) {
    const log = await integracionLogRepository.findById(id);
    if (!log) {
      throw new Error('Log de integración no encontrado');
    }
    return log;
  },

  /**
   * Listar logs de integración
   */
  async list(page = 1, limit = 50, filters = {}) {
    return await integracionLogRepository.findAll(page, limit, filters);
  },

  /**
   * Listar logs por sistema externo
   */
  async getBySistema(sistema, page = 1, limit = 50) {
    const sistemasValidos = ['SIGTB', 'NETLAB', 'Otro'];
    if (!sistemasValidos.includes(sistema)) {
      throw new Error(`Sistema inválido. Debe ser uno de: ${sistemasValidos.join(', ')}`);
    }
    return await integracionLogRepository.findBySistema(sistema, page, limit);
  },

  /**
   * Crear log de integración
   */
  async create(logData) {
    return await integracionLogRepository.create(logData);
  },

  /**
   * Actualizar log de integración (para actualizar estado después de la operación)
   */
  async update(id, logData) {
    const log = await integracionLogRepository.findById(id);
    if (!log) {
      throw new Error('Log de integración no encontrado');
    }
    return await integracionLogRepository.update(id, logData);
  }
};

module.exports = integracionLogService;
