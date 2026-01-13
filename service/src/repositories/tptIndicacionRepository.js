const { TptIndicacion, Contacto, EsquemaTpt, EstablecimientoSalud, Usuario } = require('../models');
const { Op } = require('sequelize');

const tptIndicacionRepository = {
  /**
   * Crear nueva indicación TPT
   */
  async create(indicacionData) {
    const indicacion = await TptIndicacion.create(indicacionData);
    return await this.findById(indicacion.id);
  },

  /**
   * Buscar indicación por ID
   */
  async findById(id) {
    const indicacion = await TptIndicacion.findByPk(id, {
      include: [
        {
          model: Contacto,
          as: 'contacto',
          attributes: ['id', 'nombres', 'apellidos', 'dni']
        },
        {
          model: EsquemaTpt,
          as: 'esquemaTpt',
          attributes: ['id', 'codigo', 'nombre', 'duracion_meses', 'medicamentos']
        },
        {
          model: EstablecimientoSalud,
          as: 'establecimiento',
          attributes: ['id', 'nombre']
        },
        {
          model: Usuario,
          as: 'usuarioIndicacion',
          attributes: ['id', 'nombres', 'apellidos']
        }
      ]
    });
    return indicacion ? indicacion.toJSON() : null;
  },

  /**
   * Listar indicaciones por contacto
   */
  async findByContacto(contactoId) {
    const indicaciones = await TptIndicacion.findAll({
      where: { contacto_id: contactoId },
      include: [
        {
          model: EsquemaTpt,
          as: 'esquemaTpt',
          attributes: ['id', 'codigo', 'nombre']
        }
      ],
      order: [['fecha_indicacion', 'DESC']]
    });
    return indicaciones.map(i => i.toJSON());
  },

  /**
   * Listar indicaciones con paginación
   */
  async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.contacto_id) {
      where.contacto_id = filters.contacto_id;
    }
    if (filters.estado) {
      where.estado = filters.estado;
    }
    if (filters.establecimiento_id) {
      where.establecimiento_id = filters.establecimiento_id;
    }
    if (filters.fecha_inicio_desde) {
      where.fecha_inicio = { [Op.gte]: filters.fecha_inicio_desde };
    }

    const { count, rows } = await TptIndicacion.findAndCountAll({
      where,
      include: [
        {
          model: Contacto,
          as: 'contacto',
          attributes: ['id', 'nombres', 'apellidos', 'dni']
        },
        {
          model: EsquemaTpt,
          as: 'esquemaTpt',
          attributes: ['id', 'codigo', 'nombre']
        },
        {
          model: EstablecimientoSalud,
          as: 'establecimiento',
          attributes: ['id', 'nombre']
        }
      ],
      limit,
      offset,
      order: [['fecha_indicacion', 'DESC']]
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
   * Actualizar indicación
   */
  async update(id, indicacionData) {
    await TptIndicacion.update(indicacionData, {
      where: { id }
    });
    return await this.findById(id);
  },

  /**
   * Eliminar indicación
   */
  async delete(id) {
    await TptIndicacion.destroy({
      where: { id }
    });
    return true;
  }
};

module.exports = tptIndicacionRepository;
