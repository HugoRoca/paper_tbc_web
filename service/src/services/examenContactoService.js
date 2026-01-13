const examenContactoRepository = require('../repositories/examenContactoRepository');
const contactoRepository = require('../repositories/contactoRepository');

const examenContactoService = {
  /**
   * Crear nuevo examen de contacto
   */
  async create(examenData, userId) {
    // Verificar que el contacto existe
    const contacto = await contactoRepository.findById(examenData.contacto_id);
    if (!contacto) {
      throw new Error('Contacto no encontrado');
    }

    examenData.usuario_registro_id = userId;
    return await examenContactoRepository.create(examenData);
  },

  /**
   * Obtener examen por ID
   */
  async getById(id) {
    const examen = await examenContactoRepository.findById(id);
    if (!examen) {
      throw new Error('Examen no encontrado');
    }
    return examen;
  },

  /**
   * Listar exámenes por contacto
   */
  async getByContacto(contactoId) {
    return await examenContactoRepository.findByContacto(contactoId);
  },

  /**
   * Listar exámenes
   */
  async list(page = 1, limit = 10, filters = {}) {
    return await examenContactoRepository.findAll(page, limit, filters);
  },

  /**
   * Actualizar examen
   */
  async update(id, examenData) {
    const examen = await examenContactoRepository.findById(id);
    if (!examen) {
      throw new Error('Examen no encontrado');
    }

    // No permitir cambiar ciertos campos
    delete examenData.contacto_id;
    delete examenData.usuario_registro_id;

    return await examenContactoRepository.update(id, examenData);
  },

  /**
   * Eliminar examen
   */
  async delete(id) {
    const examen = await examenContactoRepository.findById(id);
    if (!examen) {
      throw new Error('Examen no encontrado');
    }
    return await examenContactoRepository.delete(id);
  }
};

module.exports = examenContactoService;
