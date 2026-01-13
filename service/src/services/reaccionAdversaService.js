const reaccionAdversaRepository = require('../repositories/reaccionAdversaRepository');
const tptIndicacionRepository = require('../repositories/tptIndicacionRepository');

const reaccionAdversaService = {
  /**
   * Crear nueva reacción adversa
   */
  async create(reaccionData, userId) {
    // Verificar que la indicación TPT existe
    const indicacion = await tptIndicacionRepository.findById(reaccionData.tpt_indicacion_id);
    if (!indicacion) {
      throw new Error('Indicación TPT no encontrada');
    }

    reaccionData.usuario_registro_id = userId;
    return await reaccionAdversaRepository.create(reaccionData);
  },

  /**
   * Obtener reacción adversa por ID
   */
  async getById(id) {
    const reaccion = await reaccionAdversaRepository.findById(id);
    if (!reaccion) {
      throw new Error('Reacción adversa no encontrada');
    }
    return reaccion;
  },

  /**
   * Listar reacciones por indicación TPT
   */
  async getByTptIndicacion(tptIndicacionId) {
    return await reaccionAdversaRepository.findByTptIndicacion(tptIndicacionId);
  },

  /**
   * Listar reacciones adversas
   */
  async list(page = 1, limit = 10, filters = {}) {
    return await reaccionAdversaRepository.findAll(page, limit, filters);
  },

  /**
   * Actualizar reacción adversa
   */
  async update(id, reaccionData) {
    const reaccion = await reaccionAdversaRepository.findById(id);
    if (!reaccion) {
      throw new Error('Reacción adversa no encontrada');
    }

    // No permitir cambiar ciertos campos
    delete reaccionData.tpt_indicacion_id;
    delete reaccionData.usuario_registro_id;

    return await reaccionAdversaRepository.update(id, reaccionData);
  },

  /**
   * Eliminar reacción adversa
   */
  async delete(id) {
    const reaccion = await reaccionAdversaRepository.findById(id);
    if (!reaccion) {
      throw new Error('Reacción adversa no encontrada');
    }
    return await reaccionAdversaRepository.delete(id);
  }
};

module.exports = reaccionAdversaService;
