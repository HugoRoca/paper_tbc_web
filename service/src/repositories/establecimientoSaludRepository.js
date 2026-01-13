const { EstablecimientoSalud } = require('../models');
const { Op } = require('sequelize');

const establecimientoSaludRepository = {
  /**
   * Crear nuevo establecimiento
   */
  async create(establecimientoData) {
    const establecimiento = await EstablecimientoSalud.create(establecimientoData);
    return establecimiento.toJSON();
  },

  /**
   * Buscar establecimiento por ID
   */
  async findById(id) {
    const establecimiento = await EstablecimientoSalud.findByPk(id);
    return establecimiento ? establecimiento.toJSON() : null;
  },

  /**
   * Buscar establecimiento por código
   */
  async findByCodigo(codigo) {
    const establecimiento = await EstablecimientoSalud.findOne({
      where: { codigo, activo: true }
    });
    return establecimiento ? establecimiento.toJSON() : null;
  },

  /**
   * Listar establecimientos
   */
  async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const where = { activo: true };

    if (filters.tipo) {
      where.tipo = filters.tipo;
    }
    if (filters.departamento) {
      where.departamento = filters.departamento;
    }
    if (filters.provincia) {
      where.provincia = filters.provincia;
    }
    if (filters.distrito) {
      where.distrito = filters.distrito;
    }
    if (filters.nombre) {
      where.nombre = { [Op.like]: `%${filters.nombre}%` };
    }

    const { count, rows } = await EstablecimientoSalud.findAndCountAll({
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
   * Actualizar establecimiento
   */
  async update(id, establecimientoData) {
    await EstablecimientoSalud.update(establecimientoData, {
      where: { id }
    });
    return await this.findById(id);
  },

  /**
   * Eliminar (soft delete) establecimiento
   */
  async delete(id) {
    await EstablecimientoSalud.update(
      { activo: false },
      { where: { id } }
    );
    return true;
  }
};

module.exports = establecimientoSaludRepository;
