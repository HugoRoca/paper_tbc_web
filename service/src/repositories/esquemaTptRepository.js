const { EsquemaTpt } = require('../models');

const esquemaTptRepository = {
  /**
   * Crear nuevo esquema TPT
   */
  async create(esquemaData) {
    const esquema = await EsquemaTpt.create(esquemaData);
    return esquema.toJSON();
  },

  /**
   * Buscar esquema por ID
   */
  async findById(id) {
    const esquema = await EsquemaTpt.findByPk(id);
    return esquema ? esquema.toJSON() : null;
  },

  /**
   * Buscar esquema por código
   */
  async findByCodigo(codigo) {
    const esquema = await EsquemaTpt.findOne({
      where: { codigo, activo: true }
    });
    return esquema ? esquema.toJSON() : null;
  },

  /**
   * Listar esquemas activos
   */
  async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const where = { activo: true };

    if (filters.activo !== undefined) {
      where.activo = filters.activo;
    }

    const { count, rows } = await EsquemaTpt.findAndCountAll({
      where,
      limit,
      offset,
      order: [['nombre', 'ASC']]
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
   * Actualizar esquema
   */
  async update(id, esquemaData) {
    await EsquemaTpt.update(esquemaData, {
      where: { id }
    });
    return await this.findById(id);
  },

  /**
   * Eliminar (soft delete) esquema
   */
  async delete(id) {
    await EsquemaTpt.update(
      { activo: false },
      { where: { id } }
    );
    return true;
  }
};

module.exports = esquemaTptRepository;
