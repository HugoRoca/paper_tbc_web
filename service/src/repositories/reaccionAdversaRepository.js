const { ReaccionAdversa, TptIndicacion, EstablecimientoSalud, Usuario } = require('../models');
const { Op } = require('sequelize');

const reaccionAdversaRepository = {
  /**
   * Crear nueva reacción adversa
   */
  async create(reaccionData) {
    const reaccion = await ReaccionAdversa.create(reaccionData);
    return await this.findById(reaccion.id);
  },

  /**
   * Buscar reacción adversa por ID
   */
  async findById(id) {
    const reaccion = await ReaccionAdversa.findByPk(id, {
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
    return reaccion ? reaccion.toJSON() : null;
  },

  /**
   * Listar reacciones por indicación TPT
   */
  async findByTptIndicacion(tptIndicacionId) {
    const reacciones = await ReaccionAdversa.findAll({
      where: { tpt_indicacion_id: tptIndicacionId },
      include: [
        {
          model: EstablecimientoSalud,
          as: 'establecimiento',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['fecha_reaccion', 'DESC']]
    });
    return reacciones.map(r => r.toJSON());
  },

  /**
   * Listar reacciones adversas con paginación
   */
  async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.tpt_indicacion_id) {
      where.tpt_indicacion_id = filters.tpt_indicacion_id;
    }
    if (filters.severidad) {
      where.severidad = filters.severidad;
    }
    if (filters.resultado) {
      where.resultado = filters.resultado;
    }
    if (filters.establecimiento_id) {
      where.establecimiento_id = filters.establecimiento_id;
    }
    if (filters.fecha_reaccion_desde) {
      where.fecha_reaccion = { [Op.gte]: filters.fecha_reaccion_desde };
    }
    if (filters.fecha_reaccion_hasta) {
      where.fecha_reaccion = { ...where.fecha_reaccion, [Op.lte]: filters.fecha_reaccion_hasta };
    }

    const { count, rows } = await ReaccionAdversa.findAndCountAll({
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
      order: [['fecha_reaccion', 'DESC']]
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
   * Actualizar reacción adversa
   */
  async update(id, reaccionData) {
    await ReaccionAdversa.update(reaccionData, {
      where: { id }
    });
    return await this.findById(id);
  },

  /**
   * Eliminar reacción adversa
   */
  async delete(id) {
    await ReaccionAdversa.destroy({
      where: { id }
    });
    return true;
  }
};

module.exports = reaccionAdversaRepository;
