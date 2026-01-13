const contactoRepository = require('../repositories/contactoRepository');
const casoIndiceRepository = require('../repositories/casoIndiceRepository');

const contactoService = {
  /**
   * Crear nuevo contacto
   */
  async create(contactoData, userId) {
    // Verificar que el caso índice existe
    const casoIndice = await casoIndiceRepository.findById(contactoData.caso_indice_id);
    if (!casoIndice) {
      throw new Error('Caso índice no encontrado');
    }

    // Establecer fecha de registro si no se proporciona
    if (!contactoData.fecha_registro) {
      contactoData.fecha_registro = new Date().toISOString().split('T')[0];
    }

    contactoData.usuario_registro_id = userId;
    return await contactoRepository.create(contactoData);
  },

  /**
   * Obtener contacto por ID
   */
  async getById(id) {
    const contacto = await contactoRepository.findById(id);
    if (!contacto) {
      throw new Error('Contacto no encontrado');
    }
    return contacto;
  },

  /**
   * Listar contactos por caso índice
   */
  async getByCasoIndice(casoIndiceId) {
    return await contactoRepository.findByCasoIndice(casoIndiceId);
  },

  /**
   * Listar contactos
   */
  async list(page = 1, limit = 10, filters = {}) {
    return await contactoRepository.findAll(page, limit, filters);
  },

  /**
   * Actualizar contacto
   */
  async update(id, contactoData) {
    const contacto = await contactoRepository.findById(id);
    if (!contacto) {
      throw new Error('Contacto no encontrado');
    }

    // No permitir cambiar ciertos campos
    delete contactoData.caso_indice_id;
    delete contactoData.usuario_registro_id;
    delete contactoData.fecha_registro;

    return await contactoRepository.update(id, contactoData);
  },

  /**
   * Eliminar contacto
   */
  async delete(id) {
    const contacto = await contactoRepository.findById(id);
    if (!contacto) {
      throw new Error('Contacto no encontrado');
    }
    return await contactoRepository.delete(id);
  }
};

module.exports = contactoService;
