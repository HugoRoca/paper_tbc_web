const { CasoIndice, EstablecimientoSalud, Usuario } = require('../models');
const { Op } = require('sequelize');

const casoIndiceRepository = {
  /**
   * Crear nuevo caso índice
   */
  async create(casoData) {
    const caso = await CasoIndice.create(casoData);
    return await this.findById(caso.id);
  },

  /**
   * Buscar caso índice por ID
   */
  async findById(id) {
    const caso = await CasoIndice.findByPk(id, {
      include: [
        {
          model: EstablecimientoSalud,
          as: 'establecimiento',
          attributes: ['id', 'nombre', 'codigo']
        },
        {
          model: Usuario,
          as: 'usuarioRegistro',
          attributes: ['id', 'nombres', 'apellidos']
        }
      ]
    });
    return caso ? caso.toJSON() : null;
  },

  /**
   * Buscar caso índice por código
   */
  async findByCodigo(codigoCaso) {
    const caso = await CasoIndice.findOne({
      where: { codigo_caso: codigoCaso, activo: true }
    });
    return caso ? caso.toJSON() : null;
  },

  /**
   * Listar casos índice con paginación
   */
  async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const where = { activo: true };

    if (filters.tipo_tb) {
      where.tipo_tb = filters.tipo_tb;
    }
    if (filters.establecimiento_id) {
      where.establecimiento_id = filters.establecimiento_id;
    }
    if (filters.paciente_dni) {
      where.paciente_dni = { [Op.like]: `%${filters.paciente_dni}%` };
    }

    const { count, rows } = await CasoIndice.findAndCountAll({
      where,
      include: [
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
   * Actualizar caso índice
   */
  async update(id, casoData) {
    await CasoIndice.update(casoData, {
      where: { id }
    });
    return await this.findById(id);
  },

  /**
   * Eliminar (soft delete) caso índice
   */
  async delete(id) {
    await CasoIndice.update(
      { activo: false },
      { where: { id } }
    );
    return true;
  }
};

module.exports = casoIndiceRepository;
