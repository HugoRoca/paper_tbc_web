const { Contacto, CasoIndice, EstablecimientoSalud } = require('../models');
const { Op } = require('sequelize');

const contactoRepository = {
  /**
   * Crear nuevo contacto
   */
  async create(contactoData) {
    const contacto = await Contacto.create(contactoData);
    return await this.findById(contacto.id);
  },

  /**
   * Buscar contacto por ID
   */
  async findById(id) {
    const contacto = await Contacto.findByPk(id, {
      include: [
        {
          model: CasoIndice,
          as: 'casoIndice',
          attributes: ['id', 'codigo_caso', 'paciente_nombres', 'paciente_apellidos']
        },
        {
          model: EstablecimientoSalud,
          as: 'establecimiento',
          attributes: ['id', 'nombre']
        }
      ]
    });
    return contacto ? contacto.toJSON() : null;
  },

  /**
   * Listar contactos por caso índice
   */
  async findByCasoIndice(casoIndiceId) {
    const contactos = await Contacto.findAll({
      where: { caso_indice_id: casoIndiceId, activo: true },
      include: [
        {
          model: EstablecimientoSalud,
          as: 'establecimiento',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['tipo_contacto', 'ASC'], ['nombres', 'ASC']]
    });
    return contactos.map(c => c.toJSON());
  },

  /**
   * Listar contactos con paginación
   */
  async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const where = { activo: true };

    if (filters.tipo_contacto) {
      where.tipo_contacto = filters.tipo_contacto;
    }
    if (filters.caso_indice_id) {
      where.caso_indice_id = filters.caso_indice_id;
    }
    if (filters.establecimiento_id) {
      where.establecimiento_id = filters.establecimiento_id;
    }
    if (filters.dni) {
      where.dni = { [Op.like]: `%${filters.dni}%` };
    }

    const { count, rows } = await Contacto.findAndCountAll({
      where,
      include: [
        {
          model: CasoIndice,
          as: 'casoIndice',
          attributes: ['id', 'codigo_caso']
        },
        {
          model: EstablecimientoSalud,
          as: 'establecimiento',
          attributes: ['id', 'nombre']
        }
      ],
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
   * Actualizar contacto
   */
  async update(id, contactoData) {
    await Contacto.update(contactoData, {
      where: { id }
    });
    return await this.findById(id);
  },

  /**
   * Eliminar (soft delete) contacto
   */
  async delete(id) {
    await Contacto.update(
      { activo: false },
      { where: { id } }
    );
    return true;
  }
};

module.exports = contactoRepository;
