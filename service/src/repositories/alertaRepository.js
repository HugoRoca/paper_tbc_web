const { Alerta, Contacto, CasoIndice, TptIndicacion, ControlContacto, VisitaDomiciliaria, Usuario } = require('../models');
const { Op } = require('sequelize');

const alertaRepository = {
  /**
   * Crear nueva alerta
   */
  async create(alertaData) {
    const alerta = await Alerta.create(alertaData);
    return await this.findById(alerta.id);
  },

  /**
   * Buscar alerta por ID
   */
  async findById(id) {
    const alerta = await Alerta.findByPk(id, {
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
          attributes: ['id', 'codigo_caso'],
          required: false
        },
        {
          model: TptIndicacion,
          as: 'tptIndicacion',
          attributes: ['id', 'estado'],
          required: false
        },
        {
          model: ControlContacto,
          as: 'controlContacto',
          attributes: ['id', 'numero_control', 'estado'],
          required: false
        },
        {
          model: VisitaDomiciliaria,
          as: 'visitaDomiciliaria',
          attributes: ['id', 'fecha_visita', 'resultado_visita'],
          required: false
        },
        {
          model: Usuario,
          as: 'usuarioResuelve',
          attributes: ['id', 'nombres', 'apellidos'],
          required: false
        }
      ]
    });
    return alerta ? alerta.toJSON() : null;
  },

  /**
   * Listar alertas activas
   */
  async findActivas(filters = {}) {
    const where = { estado: 'Activa' };

    if (filters.contacto_id) {
      where.contacto_id = filters.contacto_id;
    }
    if (filters.caso_indice_id) {
      where.caso_indice_id = filters.caso_indice_id;
    }
    if (filters.tipo_alerta) {
      where.tipo_alerta = filters.tipo_alerta;
    }
    if (filters.severidad) {
      where.severidad = filters.severidad;
    }
    if (filters.establecimiento_id) {
      // Necesitaríamos hacer join con contactos o casos_indice
      // Por ahora lo omitimos
    }

    const alertas = await Alerta.findAll({
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
        }
      ],
      order: [
        ['severidad', 'DESC'],
        ['fecha_alerta', 'DESC']
      ]
    });
    return alertas.map(a => a.toJSON());
  },

  /**
   * Listar alertas con paginación
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
    if (filters.tipo_alerta) {
      where.tipo_alerta = filters.tipo_alerta;
    }
    if (filters.estado) {
      where.estado = filters.estado;
    }
    if (filters.severidad) {
      where.severidad = filters.severidad;
    }
    if (filters.fecha_alerta_desde) {
      where.fecha_alerta = { [Op.gte]: filters.fecha_alerta_desde };
    }
    if (filters.fecha_alerta_hasta) {
      where.fecha_alerta = { ...where.fecha_alerta, [Op.lte]: filters.fecha_alerta_hasta };
    }

    const { count, rows } = await Alerta.findAndCountAll({
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
        }
      ],
      limit,
      offset,
      order: [
        ['severidad', 'DESC'],
        ['fecha_alerta', 'DESC']
      ]
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
   * Actualizar alerta
   */
  async update(id, alertaData) {
    await Alerta.update(alertaData, {
      where: { id }
    });
    return await this.findById(id);
  },

  /**
   * Resolver alerta
   */
  async resolver(id, usuarioId, observaciones) {
    await Alerta.update(
      {
        estado: 'Resuelta',
        fecha_resolucion: new Date().toISOString().split('T')[0],
        usuario_resuelve_id: usuarioId,
        observaciones
      },
      { where: { id } }
    );
    return await this.findById(id);
  },

  /**
   * Eliminar alerta
   */
  async delete(id) {
    await Alerta.destroy({
      where: { id }
    });
    return true;
  }
};

module.exports = alertaRepository;
