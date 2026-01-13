const { VisitaDomiciliaria, Contacto, CasoIndice, EstablecimientoSalud, Usuario } = require('../models');
const { Op } = require('sequelize');

const visitaDomiciliariaRepository = {
  /**
   * Crear nueva visita domiciliaria
   */
  async create(visitaData) {
    const visita = await VisitaDomiciliaria.create(visitaData);
    return await this.findById(visita.id);
  },

  /**
   * Buscar visita por ID
   */
  async findById(id) {
    const visita = await VisitaDomiciliaria.findByPk(id, {
      include: [
        {
          model: Contacto,
          as: 'contacto',
          attributes: ['id', 'nombres', 'apellidos', 'dni'],
          required: false
        },
        {
          model: CasoIndice,
          as: 'casoIndice',
          attributes: ['id', 'codigo_caso', 'paciente_nombres', 'paciente_apellidos'],
          required: false
        },
        {
          model: EstablecimientoSalud,
          as: 'establecimiento',
          attributes: ['id', 'nombre']
        },
        {
          model: Usuario,
          as: 'usuarioVisita',
          attributes: ['id', 'nombres', 'apellidos']
        }
      ]
    });
    return visita ? visita.toJSON() : null;
  },

  /**
   * Listar visitas por contacto
   */
  async findByContacto(contactoId) {
    const visitas = await VisitaDomiciliaria.findAll({
      where: { contacto_id: contactoId },
      include: [
        {
          model: EstablecimientoSalud,
          as: 'establecimiento',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['fecha_visita', 'DESC']]
    });
    return visitas.map(v => v.toJSON());
  },

  /**
   * Listar visitas por caso índice
   */
  async findByCasoIndice(casoIndiceId) {
    const visitas = await VisitaDomiciliaria.findAll({
      where: { caso_indice_id: casoIndiceId },
      include: [
        {
          model: EstablecimientoSalud,
          as: 'establecimiento',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['fecha_visita', 'DESC']]
    });
    return visitas.map(v => v.toJSON());
  },

  /**
   * Listar visitas con paginación
   */
  async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.contacto_id) {
      where.contacto_id = filters.contacto_id;
    }
    if (filters.caso_indice_id) {
      where.caso_indice_id = filters.caso_indice_id;
    }
    if (filters.tipo_visita) {
      where.tipo_visita = filters.tipo_visita;
    }
    if (filters.resultado_visita) {
      where.resultado_visita = filters.resultado_visita;
    }
    if (filters.establecimiento_id) {
      where.establecimiento_id = filters.establecimiento_id;
    }
    if (filters.fecha_visita_desde) {
      where.fecha_visita = { [Op.gte]: filters.fecha_visita_desde };
    }
    if (filters.fecha_visita_hasta) {
      where.fecha_visita = { ...where.fecha_visita, [Op.lte]: filters.fecha_visita_hasta };
    }

    const { count, rows } = await VisitaDomiciliaria.findAndCountAll({
      where,
      include: [
        {
          model: Contacto,
          as: 'contacto',
          attributes: ['id', 'nombres', 'apellidos'],
          required: false
        },
        {
          model: CasoIndice,
          as: 'casoIndice',
          attributes: ['id', 'codigo_caso'],
          required: false
        },
        {
          model: EstablecimientoSalud,
          as: 'establecimiento',
          attributes: ['id', 'nombre']
        }
      ],
      limit,
      offset,
      order: [['fecha_visita', 'DESC']]
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
   * Actualizar visita
   */
  async update(id, visitaData) {
    await VisitaDomiciliaria.update(visitaData, {
      where: { id }
    });
    return await this.findById(id);
  },

  /**
   * Eliminar visita
   */
  async delete(id) {
    await VisitaDomiciliaria.destroy({
      where: { id }
    });
    return true;
  }
};

module.exports = visitaDomiciliariaRepository;
