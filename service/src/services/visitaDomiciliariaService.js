const visitaDomiciliariaRepository = require('../repositories/visitaDomiciliariaRepository');
const contactoRepository = require('../repositories/contactoRepository');
const casoIndiceRepository = require('../repositories/casoIndiceRepository');

const visitaDomiciliariaService = {
  /**
   * Crear nueva visita domiciliaria
   */
  async create(visitaData, userId) {
    // Verificar que al menos contacto o caso índice existe
    if (visitaData.contacto_id) {
      const contacto = await contactoRepository.findById(visitaData.contacto_id);
      if (!contacto) {
        throw new Error('Contacto no encontrado');
      }
    }

    if (visitaData.caso_indice_id) {
      const casoIndice = await casoIndiceRepository.findById(visitaData.caso_indice_id);
      if (!casoIndice) {
        throw new Error('Caso índice no encontrado');
      }
    }

    if (!visitaData.contacto_id && !visitaData.caso_indice_id) {
      throw new Error('Debe especificar contacto_id o caso_indice_id');
    }

    visitaData.usuario_visita_id = userId;
    return await visitaDomiciliariaRepository.create(visitaData);
  },

  /**
   * Obtener visita por ID
   */
  async getById(id) {
    const visita = await visitaDomiciliariaRepository.findById(id);
    if (!visita) {
      throw new Error('Visita domiciliaria no encontrada');
    }
    return visita;
  },

  /**
   * Listar visitas por contacto
   */
  async getByContacto(contactoId) {
    return await visitaDomiciliariaRepository.findByContacto(contactoId);
  },

  /**
   * Listar visitas por caso índice
   */
  async getByCasoIndice(casoIndiceId) {
    return await visitaDomiciliariaRepository.findByCasoIndice(casoIndiceId);
  },

  /**
   * Listar visitas
   */
  async list(page = 1, limit = 10, filters = {}) {
    return await visitaDomiciliariaRepository.findAll(page, limit, filters);
  },

  /**
   * Actualizar visita
   */
  async update(id, visitaData) {
    const visita = await visitaDomiciliariaRepository.findById(id);
    if (!visita) {
      throw new Error('Visita domiciliaria no encontrada');
    }

    // No permitir cambiar ciertos campos
    delete visitaData.usuario_visita_id;

    return await visitaDomiciliariaRepository.update(id, visitaData);
  },

  /**
   * Eliminar visita
   */
  async delete(id) {
    const visita = await visitaDomiciliariaRepository.findById(id);
    if (!visita) {
      throw new Error('Visita domiciliaria no encontrada');
    }
    return await visitaDomiciliariaRepository.delete(id);
  }
};

module.exports = visitaDomiciliariaService;
