const tptConsentimientoRepository = require('../repositories/tptConsentimientoRepository');
const tptIndicacionRepository = require('../repositories/tptIndicacionRepository');

const tptConsentimientoService = {
  /**
   * Crear nuevo consentimiento TPT
   */
  async create(consentimientoData, userId) {
    // Verificar que la indicación TPT existe
    const indicacion = await tptIndicacionRepository.findById(consentimientoData.tpt_indicacion_id);
    if (!indicacion) {
      throw new Error('Indicación TPT no encontrada');
    }

    // Verificar que no exista ya un consentimiento
    const existing = await tptConsentimientoRepository.findByTptIndicacion(consentimientoData.tpt_indicacion_id);
    if (existing) {
      throw new Error('Ya existe un consentimiento para esta indicación TPT');
    }

    consentimientoData.usuario_registro_id = userId;
    return await tptConsentimientoRepository.create(consentimientoData);
  },

  /**
   * Obtener consentimiento por ID
   */
  async getById(id) {
    const consentimiento = await tptConsentimientoRepository.findById(id);
    if (!consentimiento) {
      throw new Error('Consentimiento no encontrado');
    }
    return consentimiento;
  },

  /**
   * Obtener consentimiento por indicación TPT
   */
  async getByTptIndicacion(tptIndicacionId) {
    const consentimiento = await tptConsentimientoRepository.findByTptIndicacion(tptIndicacionId);
    if (!consentimiento) {
      throw new Error('Consentimiento no encontrado para esta indicación TPT');
    }
    return consentimiento;
  },

  /**
   * Actualizar consentimiento
   */
  async update(id, consentimientoData) {
    const consentimiento = await tptConsentimientoRepository.findById(id);
    if (!consentimiento) {
      throw new Error('Consentimiento no encontrado');
    }

    // No permitir cambiar la indicación TPT
    delete consentimientoData.tpt_indicacion_id;
    delete consentimientoData.usuario_registro_id;

    return await tptConsentimientoRepository.update(id, consentimientoData);
  },

  /**
   * Eliminar consentimiento
   */
  async delete(id) {
    const consentimiento = await tptConsentimientoRepository.findById(id);
    if (!consentimiento) {
      throw new Error('Consentimiento no encontrado');
    }
    return await tptConsentimientoRepository.delete(id);
  }
};

module.exports = tptConsentimientoService;
