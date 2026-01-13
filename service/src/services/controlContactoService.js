const controlContactoRepository = require('../repositories/controlContactoRepository');
const contactoRepository = require('../repositories/contactoRepository');

const controlContactoService = {
  /**
   * Crear nuevo control de contacto
   */
  async create(controlData, userId) {
    // Verificar que el contacto existe
    const contacto = await contactoRepository.findById(controlData.contacto_id);
    if (!contacto) {
      throw new Error('Contacto no encontrado');
    }

    // Si no se proporciona número de control, obtener el siguiente
    if (!controlData.numero_control) {
      controlData.numero_control = await controlContactoRepository.getNextControlNumber(controlData.contacto_id);
    }

    controlData.usuario_programa_id = userId;
    return await controlContactoRepository.create(controlData);
  },

  /**
   * Obtener control por ID
   */
  async getById(id) {
    const control = await controlContactoRepository.findById(id);
    if (!control) {
      throw new Error('Control no encontrado');
    }
    return control;
  },

  /**
   * Listar controles por contacto
   */
  async getByContacto(contactoId) {
    return await controlContactoRepository.findByContacto(contactoId);
  },

  /**
   * Listar controles
   */
  async list(page = 1, limit = 10, filters = {}) {
    return await controlContactoRepository.findAll(page, limit, filters);
  },

  /**
   * Marcar control como realizado
   */
  async marcarRealizado(id, resultado, usuarioRealizaId) {
    const control = await controlContactoRepository.findById(id);
    if (!control) {
      throw new Error('Control no encontrado');
    }

    return await controlContactoRepository.update(id, {
      estado: 'Realizado',
      fecha_realizada: new Date().toISOString().split('T')[0],
      resultado,
      usuario_realiza_id: usuarioRealizaId
    });
  },

  /**
   * Actualizar control
   */
  async update(id, controlData) {
    const control = await controlContactoRepository.findById(id);
    if (!control) {
      throw new Error('Control no encontrado');
    }

    // No permitir cambiar ciertos campos
    delete controlData.contacto_id;
    delete controlData.numero_control;
    delete controlData.usuario_programa_id;

    return await controlContactoRepository.update(id, controlData);
  },

  /**
   * Eliminar control
   */
  async delete(id) {
    const control = await controlContactoRepository.findById(id);
    if (!control) {
      throw new Error('Control no encontrado');
    }
    return await controlContactoRepository.delete(id);
  }
};

module.exports = controlContactoService;
