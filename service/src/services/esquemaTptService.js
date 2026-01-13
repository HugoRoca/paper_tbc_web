const esquemaTptRepository = require('../repositories/esquemaTptRepository');

const esquemaTptService = {
  /**
   * Crear nuevo esquema TPT
   */
  async create(esquemaData) {
    // Verificar que el código no exista
    if (esquemaData.codigo) {
      const existing = await esquemaTptRepository.findByCodigo(esquemaData.codigo);
      if (existing) {
        throw new Error('El código de esquema ya existe');
      }
    }

    return await esquemaTptRepository.create(esquemaData);
  },

  /**
   * Obtener esquema por ID
   */
  async getById(id) {
    const esquema = await esquemaTptRepository.findById(id);
    if (!esquema) {
      throw new Error('Esquema TPT no encontrado');
    }
    return esquema;
  },

  /**
   * Listar esquemas activos
   */
  async list(page = 1, limit = 10, filters = {}) {
    return await esquemaTptRepository.findAll(page, limit, filters);
  },

  /**
   * Actualizar esquema
   */
  async update(id, esquemaData) {
    const esquema = await esquemaTptRepository.findById(id);
    if (!esquema) {
      throw new Error('Esquema TPT no encontrado');
    }

    // Verificar código único si se está cambiando
    if (esquemaData.codigo && esquemaData.codigo !== esquema.codigo) {
      const existing = await esquemaTptRepository.findByCodigo(esquemaData.codigo);
      if (existing) {
        throw new Error('El código de esquema ya existe');
      }
    }

    return await esquemaTptRepository.update(id, esquemaData);
  },

  /**
   * Eliminar esquema
   */
  async delete(id) {
    const esquema = await esquemaTptRepository.findById(id);
    if (!esquema) {
      throw new Error('Esquema TPT no encontrado');
    }
    return await esquemaTptRepository.delete(id);
  }
};

module.exports = esquemaTptService;
