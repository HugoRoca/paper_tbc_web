const tptIndicacionRepository = require('../repositories/tptIndicacionRepository');
const contactoRepository = require('../repositories/contactoRepository');
const esquemaTptRepository = require('../repositories/esquemaTptRepository');

const tptIndicacionService = {
  /**
   * Crear nueva indicación TPT
   */
  async create(indicacionData, userId) {
    // Verificar que el contacto existe
    const contacto = await contactoRepository.findById(indicacionData.contacto_id);
    if (!contacto) {
      throw new Error('Contacto no encontrado');
    }

    // Verificar que el esquema existe
    const esquema = await esquemaTptRepository.findById(indicacionData.esquema_tpt_id);
    if (!esquema) {
      throw new Error('Esquema TPT no encontrado');
    }

    // Calcular fecha fin prevista si se proporciona fecha inicio
    if (indicacionData.fecha_inicio && !indicacionData.fecha_fin_prevista) {
      const fechaInicio = new Date(indicacionData.fecha_inicio);
      fechaInicio.setMonth(fechaInicio.getMonth() + esquema.duracion_meses);
      indicacionData.fecha_fin_prevista = fechaInicio.toISOString().split('T')[0];
    }

    indicacionData.usuario_indicacion_id = userId;
    return await tptIndicacionRepository.create(indicacionData);
  },

  /**
   * Obtener indicación por ID
   */
  async getById(id) {
    const indicacion = await tptIndicacionRepository.findById(id);
    if (!indicacion) {
      throw new Error('Indicación TPT no encontrada');
    }
    return indicacion;
  },

  /**
   * Listar indicaciones por contacto
   */
  async getByContacto(contactoId) {
    return await tptIndicacionRepository.findByContacto(contactoId);
  },

  /**
   * Listar indicaciones
   */
  async list(page = 1, limit = 10, filters = {}) {
    return await tptIndicacionRepository.findAll(page, limit, filters);
  },

  /**
   * Iniciar TPT
   */
  async iniciar(id, fechaInicio) {
    const indicacion = await tptIndicacionRepository.findById(id);
    if (!indicacion) {
      throw new Error('Indicación TPT no encontrada');
    }

    if (indicacion.estado !== 'Indicado') {
      throw new Error('Solo se pueden iniciar TPT en estado "Indicado"');
    }

    // Calcular fecha fin prevista
    const esquema = await esquemaTptRepository.findById(indicacion.esquema_tpt_id);
    const fechaInicioDate = new Date(fechaInicio);
    fechaInicioDate.setMonth(fechaInicioDate.getMonth() + esquema.duracion_meses);
    const fechaFinPrevista = fechaInicioDate.toISOString().split('T')[0];

    return await tptIndicacionRepository.update(id, {
      estado: 'En curso',
      fecha_inicio: fechaInicio,
      fecha_fin_prevista: fechaFinPrevista
    });
  },

  /**
   * Actualizar indicación
   */
  async update(id, indicacionData) {
    const indicacion = await tptIndicacionRepository.findById(id);
    if (!indicacion) {
      throw new Error('Indicación TPT no encontrada');
    }

    // No permitir cambiar ciertos campos
    delete indicacionData.contacto_id;
    delete indicacionData.usuario_indicacion_id;

    return await tptIndicacionRepository.update(id, indicacionData);
  },

  /**
   * Eliminar indicación
   */
  async delete(id) {
    const indicacion = await tptIndicacionRepository.findById(id);
    if (!indicacion) {
      throw new Error('Indicación TPT no encontrada');
    }
    return await tptIndicacionRepository.delete(id);
  }
};

module.exports = tptIndicacionService;
