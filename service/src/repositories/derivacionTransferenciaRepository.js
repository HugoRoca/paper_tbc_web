const { DerivacionTransferencia, Contacto, EstablecimientoSalud, Usuario } = require('../models');
const { Op } = require('sequelize');

const derivacionTransferenciaRepository = {
  /**
   * Crear nueva derivación/transferencia
   */
  async create(derivacionData) {
    const derivacion = await DerivacionTransferencia.create(derivacionData);
    return await this.findById(derivacion.id);
  },

  /**
   * Buscar derivación por ID
   */
  async findById(id) {
    const derivacion = await DerivacionTransferencia.findByPk(id, {
      include: [
        {
          model: Contacto,
          as: 'contacto',
          attributes: ['id', 'nombres', 'apellidos', 'dni']
        },
        {
          model: EstablecimientoSalud,
          as: 'establecimientoOrigen',
          attributes: ['id', 'nombre', 'codigo']
        },
        {
          model: EstablecimientoSalud,
          as: 'establecimientoDestino',
          attributes: ['id', 'nombre', 'codigo']
        },
        {
          model: Usuario,
          as: 'usuarioSolicita',
          attributes: ['id', 'nombres', 'apellidos']
        },
        {
          model: Usuario,
          as: 'usuarioAcepta',
          attributes: ['id', 'nombres', 'apellidos'],
          required: false
        }
      ]
    });
    return derivacion ? derivacion.toJSON() : null;
  },

  /**
   * Listar derivaciones por contacto
   */
  async findByContacto(contactoId) {
    const derivaciones = await DerivacionTransferencia.findAll({
      where: { contacto_id: contactoId },
      include: [
        {
          model: EstablecimientoSalud,
          as: 'establecimientoOrigen',
          attributes: ['id', 'nombre']
        },
        {
          model: EstablecimientoSalud,
          as: 'establecimientoDestino',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['fecha_solicitud', 'DESC']]
    });
    return derivaciones.map(d => d.toJSON());
  },

  /**
   * Listar derivaciones pendientes por establecimiento destino
   */
  async findPendientesByEstablecimiento(establecimientoId) {
    const derivaciones = await DerivacionTransferencia.findAll({
      where: {
        establecimiento_destino_id: establecimientoId,
        estado: 'Pendiente'
      },
      include: [
        {
          model: Contacto,
          as: 'contacto',
          attributes: ['id', 'nombres', 'apellidos', 'dni']
        },
        {
          model: EstablecimientoSalud,
          as: 'establecimientoOrigen',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['fecha_solicitud', 'ASC']]
    });
    return derivaciones.map(d => d.toJSON());
  },

  /**
   * Listar derivaciones con paginación
   */
  async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.contacto_id) {
      where.contacto_id = filters.contacto_id;
    }
    if (filters.tipo) {
      where.tipo = filters.tipo;
    }
    if (filters.estado) {
      where.estado = filters.estado;
    }
    if (filters.establecimiento_origen_id) {
      where.establecimiento_origen_id = filters.establecimiento_origen_id;
    }
    if (filters.establecimiento_destino_id) {
      where.establecimiento_destino_id = filters.establecimiento_destino_id;
    }
    if (filters.fecha_solicitud_desde) {
      where.fecha_solicitud = { [Op.gte]: filters.fecha_solicitud_desde };
    }
    if (filters.fecha_solicitud_hasta) {
      where.fecha_solicitud = { ...where.fecha_solicitud, [Op.lte]: filters.fecha_solicitud_hasta };
    }

    const { count, rows } = await DerivacionTransferencia.findAndCountAll({
      where,
      include: [
        {
          model: Contacto,
          as: 'contacto',
          attributes: ['id', 'nombres', 'apellidos', 'dni']
        },
        {
          model: EstablecimientoSalud,
          as: 'establecimientoOrigen',
          attributes: ['id', 'nombre']
        },
        {
          model: EstablecimientoSalud,
          as: 'establecimientoDestino',
          attributes: ['id', 'nombre']
        }
      ],
      limit,
      offset,
      order: [['fecha_solicitud', 'DESC']]
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
   * Actualizar derivación
   */
  async update(id, derivacionData) {
    await DerivacionTransferencia.update(derivacionData, {
      where: { id }
    });
    return await this.findById(id);
  },

  /**
   * Eliminar derivación
   */
  async delete(id) {
    await DerivacionTransferencia.destroy({
      where: { id }
    });
    return true;
  }
};

module.exports = derivacionTransferenciaRepository;
