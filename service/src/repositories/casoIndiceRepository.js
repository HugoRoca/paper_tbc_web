const { CasoIndice, EstablecimientoSalud, Usuario, sequelize } = require('../models');
const { Op, Sequelize } = require('sequelize');

const casoIndiceRepository = {
  /**
   * Crear nuevo caso índice
   */
  async create(casoData) {
    // Normalizar fechas a strings YYYY-MM-DD
    const normalizeDate = (dateValue) => {
      if (!dateValue) return null;
      if (typeof dateValue === 'string') {
        const datePart = dateValue.split('T')[0].split(' ')[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
          return datePart;
        }
      }
      if (dateValue instanceof Date) {
        const year = dateValue.getFullYear();
        const month = String(dateValue.getMonth() + 1).padStart(2, '0');
        const day = String(dateValue.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      return dateValue;
    };
    
    // Normalizar todas las fechas a strings YYYY-MM-DD
    const fechaDiagnostico = casoData.fecha_diagnostico ? normalizeDate(casoData.fecha_diagnostico) : null;
    const fechaNacimiento = casoData.fecha_nacimiento ? normalizeDate(casoData.fecha_nacimiento) : null;
    
    // Preparar datos para raw query - insertar directamente como strings DATE
    const { fecha_diagnostico, fecha_nacimiento, ...restData } = casoData;
    
    // Construir query SQL directamente para evitar conversiones de Sequelize
    const columns = [];
    const values = [];
    const placeholders = [];
    
    // Agregar campos no-fecha
    Object.keys(restData).forEach(key => {
      if (restData[key] !== undefined && restData[key] !== null) {
        columns.push(key);
        values.push(restData[key]);
        placeholders.push('?');
      }
    });
    
    // Agregar fechas como strings directamente
    if (fechaDiagnostico) {
      columns.push('fecha_diagnostico');
      values.push(fechaDiagnostico);
      placeholders.push('?');
    }
    
    if (fechaNacimiento) {
      columns.push('fecha_nacimiento');
      values.push(fechaNacimiento);
      placeholders.push('?');
    }
    
    
    // Ejecutar raw query - insertar fechas directamente como strings DATE sin conversión
    // MySQL acepta strings en formato YYYY-MM-DD directamente para campos DATE
    const [result] = await sequelize.query(
      `INSERT INTO casos_indice (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`,
      {
        replacements: values,
        type: sequelize.QueryTypes.INSERT
      }
    );
    
    // Obtener el ID insertado
    const insertedId = Array.isArray(result) && result.length > 0 ? result[0] : result;
    
    return await this.findById(insertedId);
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
    // Normalizar fechas igual que en create
    const normalizeDate = (dateValue) => {
      if (!dateValue) return null;
      if (typeof dateValue === 'string') {
        const datePart = dateValue.split('T')[0].split(' ')[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
          return datePart;
        }
      }
      if (dateValue instanceof Date) {
        const year = dateValue.getFullYear();
        const month = String(dateValue.getMonth() + 1).padStart(2, '0');
        const day = String(dateValue.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      return dateValue;
    };
    
    // Normalizar fechas
    const fechaDiagnostico = casoData.fecha_diagnostico !== undefined ? normalizeDate(casoData.fecha_diagnostico) : undefined;
    const fechaNacimiento = casoData.fecha_nacimiento !== undefined ? normalizeDate(casoData.fecha_nacimiento) : undefined;
    
    // Preparar datos para raw query
    const { fecha_diagnostico, fecha_nacimiento, ...restData } = casoData;
    
    const setClauses = [];
    const values = [];
    
    // Agregar campos no-fecha
    Object.keys(restData).forEach(key => {
      if (restData[key] !== undefined && restData[key] !== null) {
        setClauses.push(`${key} = ?`);
        values.push(restData[key]);
      }
    });
    
    // Agregar fechas directamente como strings - MySQL acepta YYYY-MM-DD para campos DATE
    if (fechaDiagnostico !== undefined) {
      setClauses.push('fecha_diagnostico = ?');
      values.push(fechaDiagnostico || null);
    }
    
    if (fechaNacimiento !== undefined) {
      setClauses.push('fecha_nacimiento = ?');
      values.push(fechaNacimiento || null);
    }
    
    
    // Ejecutar raw query
    values.push(id);
    await sequelize.query(
      `UPDATE casos_indice SET ${setClauses.join(', ')} WHERE id = ?`,
      {
        replacements: values,
        type: sequelize.QueryTypes.UPDATE
      }
    );
    
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
