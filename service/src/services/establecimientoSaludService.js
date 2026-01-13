const establecimientoSaludRepository = require('../repositories/establecimientoSaludRepository');

const establecimientoSaludService = {
  /**
   * Crear nuevo establecimiento
   */
  async create(establecimientoData) {
    // Verificar que el código no exista
    if (establecimientoData.codigo) {
      const existing = await establecimientoSaludRepository.findByCodigo(establecimientoData.codigo);
      if (existing) {
        throw new Error('El código de establecimiento ya existe');
      }
    }

    return await establecimientoSaludRepository.create(establecimientoData);
  },

  /**
   * Obtener establecimiento por ID
   */
  async getById(id) {
    const establecimiento = await establecimientoSaludRepository.findById(id);
    if (!establecimiento) {
      throw new Error('Establecimiento de salud no encontrado');
    }
    return establecimiento;
  },

  /**
   * Listar establecimientos
   */
  async list(page = 1, limit = 10, filters = {}) {
    return await establecimientoSaludRepository.findAll(page, limit, filters);
  },

  /**
   * Actualizar establecimiento
   */
  async update(id, establecimientoData) {
    const establecimiento = await establecimientoSaludRepository.findById(id);
    if (!establecimiento) {
      throw new Error('Establecimiento de salud no encontrado');
    }

    // Verificar código único si se está cambiando
    if (establecimientoData.codigo && establecimientoData.codigo !== establecimiento.codigo) {
      const existing = await establecimientoSaludRepository.findByCodigo(establecimientoData.codigo);
      if (existing) {
        throw new Error('El código de establecimiento ya existe');
      }
    }

    return await establecimientoSaludRepository.update(id, establecimientoData);
  },

  /**
   * Eliminar establecimiento
   */
  async delete(id) {
    const establecimiento = await establecimientoSaludRepository.findById(id);
    if (!establecimiento) {
      throw new Error('Establecimiento de salud no encontrado');
    }
    return await establecimientoSaludRepository.delete(id);
  }
};

module.exports = establecimientoSaludService;
