const { ExamenContacto, Contacto, EstablecimientoSalud, Usuario } = require('../models');
const { Op } = require('sequelize');

const examenContactoRepository = {
  /**
   * Crear nuevo examen de contacto
   */
  async create(examenData) {
    const examen = await ExamenContacto.create(examenData);
    return await this.findById(examen.id);
  },

  /**
   * Buscar examen por ID
   */
  async findById(id) {
    const examen = await ExamenContacto.findByPk(id, {
      include: [
        {
          model: Contacto,
          as: 'contacto',
          attributes: ['id', 'nombres', 'apellidos', 'dni']
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
    return examen ? examen.toJSON() : null;
  },

  /**
   * Listar exámenes por contacto
   */
  async findByContacto(contactoId) {
    const examenes = await ExamenContacto.findAll({
      where: { contacto_id: contactoId },
      include: [
        {
          model: EstablecimientoSalud,
          as: 'establecimiento',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['fecha_examen', 'DESC']]
    });
    return examenes.map(e => e.toJSON());
  },

  /**
   * Listar exámenes con paginación
   */
  async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.contacto_id) {
      where.contacto_id = filters.contacto_id;
    }
    if (filters.tipo_examen) {
      where.tipo_examen = filters.tipo_examen;
    }
    if (filters.establecimiento_id) {
      where.establecimiento_id = filters.establecimiento_id;
    }
    if (filters.fecha_desde) {
      where.fecha_examen = { [Op.gte]: filters.fecha_desde };
    }
    if (filters.fecha_hasta) {
      where.fecha_examen = { ...where.fecha_examen, [Op.lte]: filters.fecha_hasta };
    }

    const { count, rows } = await ExamenContacto.findAndCountAll({
      where,
      include: [
        {
          model: Contacto,
          as: 'contacto',
          attributes: ['id', 'nombres', 'apellidos', 'dni']
        },
        {
          model: EstablecimientoSalud,
          as: 'establecimiento',
          attributes: ['id', 'nombre']
        }
      ],
      limit,
      offset,
      order: [['fecha_examen', 'DESC']]
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
   * Actualizar examen
   */
  async update(id, examenData) {
    await ExamenContacto.update(examenData, {
      where: { id }
    });
    return await this.findById(id);
  },

  /**
   * Eliminar examen
   */
  async delete(id) {
    await ExamenContacto.destroy({
      where: { id }
    });
    return true;
  }
};

module.exports = examenContactoRepository;
