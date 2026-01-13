const roleRepository = require('../repositories/roleRepository');

const roleService = {
  /**
   * Crear nuevo rol
   */
  async create(roleData) {
    // Verificar que el nombre no exista
    const existing = await roleRepository.findByName(roleData.nombre);
    if (existing) {
      throw new Error('El nombre de rol ya existe');
    }

    return await roleRepository.create(roleData);
  },

  /**
   * Obtener rol por ID
   */
  async getById(id) {
    const role = await roleRepository.findById(id);
    if (!role) {
      throw new Error('Rol no encontrado');
    }
    return role;
  },

  /**
   * Listar roles
   */
  async list(page = 1, limit = 10, filters = {}) {
    return await roleRepository.findAll(page, limit, filters);
  },

  /**
   * Actualizar rol
   */
  async update(id, roleData) {
    const role = await roleRepository.findById(id);
    if (!role) {
      throw new Error('Rol no encontrado');
    }

    // Verificar nombre único si se está cambiando
    if (roleData.nombre && roleData.nombre !== role.nombre) {
      const existing = await roleRepository.findByName(roleData.nombre);
      if (existing) {
        throw new Error('El nombre de rol ya existe');
      }
    }

    return await roleRepository.update(id, roleData);
  },

  /**
   * Eliminar rol (soft delete)
   */
  async delete(id) {
    const role = await roleRepository.findById(id);
    if (!role) {
      throw new Error('Rol no encontrado');
    }

    // TODO: Verificar que no haya usuarios con este rol antes de eliminar
    // Por ahora solo hacemos soft delete

    return await roleRepository.delete(id);
  }
};

module.exports = roleService;
