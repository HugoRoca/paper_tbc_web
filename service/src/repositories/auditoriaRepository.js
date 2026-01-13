const { Auditoria, Usuario } = require('../models');
const { Op } = require('sequelize');

const auditoriaRepository = {
  /**
   * Buscar registro de auditoría por ID
   */
  async findById(id) {
    const auditoria = await Auditoria.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombres', 'apellidos', 'email']
      }]
    });
    return auditoria ? auditoria.toJSON() : null;
  },

  /**
   * Listar registros de auditoría con paginación
   */
  async findAll(page = 1, limit = 50, filters = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.usuario_id) {
      where.usuario_id = filters.usuario_id;
    }
    if (filters.tabla_afectada) {
      where.tabla_afectada = filters.tabla_afectada;
    }
    if (filters.accion) {
      where.accion = filters.accion;
    }
    if (filters.fecha_desde) {
      where.fecha_accion = {
        ...where.fecha_accion,
        [Op.gte]: new Date(filters.fecha_desde)
      };
    }
    if (filters.fecha_hasta) {
      where.fecha_accion = {
        ...where.fecha_accion,
        [Op.lte]: new Date(filters.fecha_hasta)
      };
    }

    const { count, rows } = await Auditoria.findAndCountAll({
      where,
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombres', 'apellidos', 'email']
      }],
      limit,
      offset,
      order: [['fecha_accion', 'DESC']]
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
   * Crear registro de auditoría
   */
  async create(auditoriaData) {
    const auditoria = await Auditoria.create(auditoriaData);
    return await this.findById(auditoria.id);
  }
};

module.exports = auditoriaRepository;
