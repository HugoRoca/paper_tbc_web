const { TptSeguimiento, TptIndicacion, EstablecimientoSalud, Usuario } = require('../models');
const { Op } = require('sequelize');

const tptSeguimientoRepository = {
  /**
   * Crear nuevo seguimiento TPT
   */
  async create(seguimientoData) {
    const seguimiento = await TptSeguimiento.create(seguimientoData);
    return await this.findById(seguimiento.id);
  },

  /**
   * Buscar seguimiento por ID
   */
  async findById(id) {
    const seguimiento = await TptSeguimiento.findByPk(id, {
      include: [
        {
          model: TptIndicacion,
          as: 'tptIndicacion',
          attributes: ['id', 'fecha_inicio', 'estado']
        },
        {
          model: EstablecimientoSalud,
          as: 'establecimiento',
          attributes: ['id', 'nombre']
        },
        {
          model: Usuario,
          as: 'usuarioRegistro',
          attributes: ['id', 'nombres', 'apellidos']
        }
      ]
    });
    return seguimiento ? seguimiento.toJSON() : null;
  },

  /**
   * Listar seguimientos por indicación TPT
   */
  async findByTptIndicacion(tptIndicacionId) {
    const seguimientos = await TptSeguimiento.findAll({
      where: { tpt_indicacion_id: tptIndicacionId },
      include: [
        {
          model: EstablecimientoSalud,
          as: 'establecimiento',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['fecha_seguimiento', 'ASC']]
    });
    return seguimientos.map(s => s.toJSON());
  },

  /**
   * Listar seguimientos con paginación
   */
  async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.tpt_indicacion_id) {
      where.tpt_indicacion_id = filters.tpt_indicacion_id;
    }
    if (filters.establecimiento_id) {
      where.establecimiento_id = filters.establecimiento_id;
    }
    if (filters.fecha_seguimiento_desde) {
      where.fecha_seguimiento = { [Op.gte]: filters.fecha_seguimiento_desde };
    }
    if (filters.fecha_seguimiento_hasta) {
      where.fecha_seguimiento = { ...where.fecha_seguimiento, [Op.lte]: filters.fecha_seguimiento_hasta };
    }
    if (filters.efectos_adversos !== undefined) {
      where.efectos_adversos = filters.efectos_adversos;
    }

    const { count, rows } = await TptSeguimiento.findAndCountAll({
      where,
      include: [
        {
          model: TptIndicacion,
          as: 'tptIndicacion',
          attributes: ['id', 'estado']
        },
        {
          model: EstablecimientoSalud,
          as: 'establecimiento',
          attributes: ['id', 'nombre']
        }
      ],
      limit,
      offset,
      order: [['fecha_seguimiento', 'DESC']]
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
   * Actualizar seguimiento
   */
  async update(id, seguimientoData) {
    await TptSeguimiento.update(seguimientoData, {
      where: { id }
    });
    return await this.findById(id);
  },

  /**
   * Eliminar seguimiento
   */
  async delete(id) {
    await TptSeguimiento.destroy({
      where: { id }
    });
    return true;
  }
};

module.exports = tptSeguimientoRepository;
