const auditoriaRepository = require('../repositories/auditoriaRepository');

const auditoriaService = {
  /**
   * Obtener registro de auditoría por ID
   */
  async getById(id) {
    const auditoria = await auditoriaRepository.findById(id);
    if (!auditoria) {
      throw new Error('Registro de auditoría no encontrado');
    }
    return auditoria;
  },

  /**
   * Listar registros de auditoría
   */
  async list(page = 1, limit = 50, filters = {}) {
    return await auditoriaRepository.findAll(page, limit, filters);
  },

  /**
   * Listar auditoría por usuario
   */
  async getByUsuario(usuarioId, page = 1, limit = 50) {
    return await auditoriaRepository.findAll(page, limit, { usuario_id: usuarioId });
  },

  /**
   * Listar auditoría por tabla
   */
  async getByTabla(tabla, page = 1, limit = 50) {
    return await auditoriaRepository.findAll(page, limit, { tabla_afectada: tabla });
  }
};

module.exports = auditoriaService;
