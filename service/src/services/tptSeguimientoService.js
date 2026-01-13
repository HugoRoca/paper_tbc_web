const tptSeguimientoRepository = require('../repositories/tptSeguimientoRepository');
const tptIndicacionRepository = require('../repositories/tptIndicacionRepository');

const tptSeguimientoService = {
  /**
   * Crear nuevo seguimiento TPT
   */
  async create(seguimientoData, userId) {
    // Verificar que la indicación TPT existe
    const indicacion = await tptIndicacionRepository.findById(seguimientoData.tpt_indicacion_id);
    if (!indicacion) {
      throw new Error('Indicación TPT no encontrada');
    }

    if (indicacion.estado !== 'En curso') {
      throw new Error('Solo se puede hacer seguimiento a TPT en curso');
    }

    seguimientoData.usuario_registro_id = userId;
    return await tptSeguimientoRepository.create(seguimientoData);
  },

  /**
   * Obtener seguimiento por ID
   */
  async getById(id) {
    const seguimiento = await tptSeguimientoRepository.findById(id);
    if (!seguimiento) {
      throw new Error('Seguimiento no encontrado');
    }
    return seguimiento;
  },

  /**
   * Listar seguimientos por indicación TPT
   */
  async getByTptIndicacion(tptIndicacionId) {
    return await tptSeguimientoRepository.findByTptIndicacion(tptIndicacionId);
  },

  /**
   * Listar seguimientos
   */
  async list(page = 1, limit = 10, filters = {}) {
    return await tptSeguimientoRepository.findAll(page, limit, filters);
  },

  /**
   * Actualizar seguimiento
   */
  async update(id, seguimientoData) {
    const seguimiento = await tptSeguimientoRepository.findById(id);
    if (!seguimiento) {
      throw new Error('Seguimiento no encontrado');
    }

    // No permitir cambiar ciertos campos
    delete seguimientoData.tpt_indicacion_id;
    delete seguimientoData.usuario_registro_id;

    return await tptSeguimientoRepository.update(id, seguimientoData);
  },

  /**
   * Eliminar seguimiento
   */
  async delete(id) {
    const seguimiento = await tptSeguimientoRepository.findById(id);
    if (!seguimiento) {
      throw new Error('Seguimiento no encontrado');
    }
    return await tptSeguimientoRepository.delete(id);
  }
};

module.exports = tptSeguimientoService;
