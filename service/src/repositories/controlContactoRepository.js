const { ControlContacto, Contacto, EstablecimientoSalud, Usuario } = require('../models');
const { Op } = require('sequelize');

const controlContactoRepository = {
  /**
   * Crear nuevo control de contacto
   */
  async create(controlData) {
    const control = await ControlContacto.create(controlData);
    return await this.findById(control.id);
  },

  /**
   * Buscar control por ID
   */
  async findById(id) {
    const control = await ControlContacto.findByPk(id, {
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
          as: 'usuarioPrograma',
          attributes: ['id', 'nombres', 'apellidos']
        },
        {
          model: Usuario,
          as: 'usuarioRealiza',
          attributes: ['id', 'nombres', 'apellidos']
        }
      ]
    });
    return control ? control.toJSON() : null;
  },

  /**
   * Listar controles por contacto
   */
  async findByContacto(contactoId) {
    const controles = await ControlContacto.findAll({
      where: { contacto_id: contactoId },
      include: [
        {
          model: EstablecimientoSalud,
          as: 'establecimiento',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['numero_control', 'ASC']]
    });
    return controles.map(c => c.toJSON());
  },

  /**
   * Obtener siguiente número de control para un contacto
   */
  async getNextControlNumber(contactoId) {
    const lastControl = await ControlContacto.findOne({
      where: { contacto_id: contactoId },
      order: [['numero_control', 'DESC']]
    });
    return lastControl ? lastControl.numero_control + 1 : 1;
  },

  /**
   * Listar controles con paginación
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
    if (filters.fecha_programada_desde) {
      where.fecha_programada = { [Op.gte]: filters.fecha_programada_desde };
    }
    if (filters.fecha_programada_hasta) {
      where.fecha_programada = { ...where.fecha_programada, [Op.lte]: filters.fecha_programada_hasta };
    }

    const { count, rows } = await ControlContacto.findAndCountAll({
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
      order: [['fecha_programada', 'ASC']]
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
   * Actualizar control
   */
  async update(id, controlData) {
    await ControlContacto.update(controlData, {
      where: { id }
    });
    return await this.findById(id);
  },

  /**
   * Eliminar control
   */
  async delete(id) {
    await ControlContacto.destroy({
      where: { id }
    });
    return true;
  }
};

module.exports = controlContactoRepository;
