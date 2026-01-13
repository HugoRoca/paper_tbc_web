const { Usuario, Role } = require('../models');
const { Op } = require('sequelize');

const userRepository = {
  /**
   * Buscar usuario por email
   */
  async findByEmail(email) {
    const user = await Usuario.findOne({
      where: { email, activo: true },
      include: [{
        model: Role,
        as: 'rol',
        attributes: ['id', 'nombre', 'descripcion']
      }],
      attributes: { exclude: ['password_hash'] }
    });
    return user ? user.toJSON() : null;
  },

  /**
   * Buscar usuario por ID (con password para autenticación)
   */
  async findById(id) {
    const user = await Usuario.findByPk(id, {
      include: [{
        model: Role,
        as: 'rol',
        attributes: ['id', 'nombre', 'descripcion']
      }]
    });
    return user ? user.toJSON() : null;
  },

  /**
   * Obtener rol por ID
   */
  async getRoleById(roleId) {
    const role = await Role.findByPk(roleId);
    return role ? role.toJSON() : null;
  },

  /**
   * Actualizar último acceso
   */
  async updateLastAccess(userId) {
    await Usuario.update(
      { ultimo_acceso: new Date() },
      { where: { id: userId } }
    );
  },

  /**
   * Crear nuevo usuario
   */
  async create(userData) {
    const user = await Usuario.create(userData);
    return await this.findById(user.id);
  },

  /**
   * Listar usuarios con paginación
   */
  async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.activo !== undefined) {
      where.activo = filters.activo;
    }
    if (filters.rol_id) {
      where.rol_id = filters.rol_id;
    }
    if (filters.establecimiento_id) {
      where.establecimiento_id = filters.establecimiento_id;
    }
    if (filters.search) {
      where[Op.or] = [
        { nombres: { [Op.like]: `%${filters.search}%` } },
        { apellidos: { [Op.like]: `%${filters.search}%` } },
        { email: { [Op.like]: `%${filters.search}%` } },
        { dni: { [Op.like]: `%${filters.search}%` } }
      ];
    }

    const { count, rows } = await Usuario.findAndCountAll({
      where,
      include: [
        {
          model: Role,
          as: 'rol',
          attributes: ['id', 'nombre']
        }
      ],
      attributes: { exclude: ['password_hash'] },
      limit,
      offset,
      order: [['created_at', 'DESC']]
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
   * Actualizar usuario
   */
  async update(id, userData) {
    // No permitir actualizar password_hash directamente
    delete userData.password_hash;
    
    await Usuario.update(userData, {
      where: { id }
    });
    
    return await this.findById(id);
  },

  /**
   * Actualizar contraseña
   */
  async updatePassword(id, passwordHash) {
    await Usuario.update(
      { password_hash: passwordHash },
      { where: { id } }
    );
  },

  /**
   * Eliminar usuario (soft delete)
   */
  async delete(id) {
    await Usuario.update(
      { activo: false },
      { where: { id } }
    );
    return await this.findById(id);
  },

  /**
   * Buscar usuario por DNI
   */
  async findByDni(dni) {
    const user = await Usuario.findOne({
      where: { dni, activo: true },
      include: [{
        model: Role,
        as: 'rol',
        attributes: ['id', 'nombre', 'descripcion']
      }],
      attributes: { exclude: ['password_hash'] }
    });
    return user ? user.toJSON() : null;
  }
};

module.exports = userRepository;
