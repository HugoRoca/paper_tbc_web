const { Role } = require('../models');
const { Op } = require('sequelize');

const roleRepository = {
  /**
   * Buscar rol por ID
   */
  async findById(id) {
    const role = await Role.findByPk(id);
    return role ? role.toJSON() : null;
  },

  /**
   * Buscar rol por nombre
   */
  async findByName(nombre) {
    const role = await Role.findOne({
      where: { nombre, activo: true }
    });
    return role ? role.toJSON() : null;
  },

  /**
   * Listar roles con paginación
   */
  async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.activo !== undefined) {
      where.activo = filters.activo;
    }
    if (filters.search) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${filters.search}%` } },
        { descripcion: { [Op.like]: `%${filters.search}%` } }
      ];
    }

    const { count, rows } = await Role.findAndCountAll({
      where,
      limit,
      offset,
      order: [['nombre', 'ASC']]
    });

    return {
      data: rows.map(r => r.toJSON()),
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  },

  /**
   * Crear nuevo rol
   */
  async create(roleData) {
    const role = await Role.create(roleData);
    return await this.findById(role.id);
  },

  /**
   * Actualizar rol
   */
  async update(id, roleData) {
    await Role.update(roleData, {
      where: { id }
    });
    return await this.findById(id);
  },

  /**
   * Eliminar rol (soft delete)
   */
  async delete(id) {
    await Role.update(
      { activo: false },
      { where: { id } }
    );
    return await this.findById(id);
  }
};

module.exports = roleRepository;
