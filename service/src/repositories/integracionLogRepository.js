const { IntegracionLog, Usuario } = require('../models');
const { Op } = require('sequelize');

const integracionLogRepository = {
  /**
   * Buscar log de integración por ID
   */
  async findById(id) {
    const log = await IntegracionLog.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombres', 'apellidos', 'email']
      }]
    });
    return log ? log.toJSON() : null;
  },

  /**
   * Listar logs de integración con paginación
   */
  async findAll(page = 1, limit = 50, filters = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.sistema_externo) {
      where.sistema_externo = filters.sistema_externo;
    }
    if (filters.tipo_operacion) {
      where.tipo_operacion = filters.tipo_operacion;
    }
    if (filters.estado) {
      where.estado = filters.estado;
    }
    if (filters.usuario_id) {
      where.usuario_id = filters.usuario_id;
    }
    if (filters.fecha_desde) {
      where.created_at = {
        ...where.created_at,
        [Op.gte]: new Date(filters.fecha_desde)
      };
    }
    if (filters.fecha_hasta) {
      where.created_at = {
        ...where.created_at,
        [Op.lte]: new Date(filters.fecha_hasta)
      };
    }

    const { count, rows } = await IntegracionLog.findAndCountAll({
      where,
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombres', 'apellidos', 'email']
      }],
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
   * Listar logs por sistema externo
   */
  async findBySistema(sistema, page = 1, limit = 50) {
    return await this.findAll(page, limit, { sistema_externo: sistema });
  },

  /**
   * Crear log de integración
   */
  async create(logData) {
    const log = await IntegracionLog.create(logData);
    return await this.findById(log.id);
  },

  /**
   * Actualizar log de integración
   */
  async update(id, logData) {
    await IntegracionLog.update(logData, {
      where: { id }
    });
    return await this.findById(id);
  }
};

module.exports = integracionLogRepository;
