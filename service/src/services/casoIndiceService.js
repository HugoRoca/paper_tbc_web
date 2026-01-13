const casoIndiceRepository = require('../repositories/casoIndiceRepository');
const { CasoIndice } = require('../models');

const casoIndiceService = {
  /**
   * Crear nuevo caso índice
   */
  async create(casoData, userId) {
    // Generar código de caso si no se proporciona
    if (!casoData.codigo_caso) {
      const year = new Date().getFullYear();
      const count = await this.getNextCaseNumber(year);
      casoData.codigo_caso = `CI-${year}-${String(count).padStart(3, '0')}`;
    }

    // Verificar que el código no exista
    const existing = await casoIndiceRepository.findByCodigo(casoData.codigo_caso);
    if (existing) {
      throw new Error('El código de caso ya existe');
    }

    casoData.usuario_registro_id = userId;
    return await casoIndiceRepository.create(casoData);
  },

  /**
   * Obtener siguiente número de caso para el año
   */
  async getNextCaseNumber(year) {
    const { Op } = require('sequelize');
    const count = await CasoIndice.count({
      where: {
        codigo_caso: {
          [Op.like]: `CI-${year}-%`
        }
      }
    });
    return count + 1;
  },

  /**
   * Obtener caso índice por ID
   */
  async getById(id) {
    const caso = await casoIndiceRepository.findById(id);
    if (!caso) {
      throw new Error('Caso índice no encontrado');
    }
    return caso;
  },

  /**
   * Listar casos índice
   */
  async list(page = 1, limit = 10, filters = {}) {
    return await casoIndiceRepository.findAll(page, limit, filters);
  },

  /**
   * Actualizar caso índice
   */
  async update(id, casoData, userId) {
    const caso = await casoIndiceRepository.findById(id);
    if (!caso) {
      throw new Error('Caso índice no encontrado');
    }

    // No permitir cambiar el código de caso
    delete casoData.codigo_caso;
    delete casoData.usuario_registro_id;

    return await casoIndiceRepository.update(id, casoData);
  },

  /**
   * Eliminar caso índice
   */
  async delete(id) {
    const caso = await casoIndiceRepository.findById(id);
    if (!caso) {
      throw new Error('Caso índice no encontrado');
    }
    return await casoIndiceRepository.delete(id);
  }
};

module.exports = casoIndiceService;
