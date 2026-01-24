const casoIndiceRepository = require('../repositories/casoIndiceRepository');
const { CasoIndice } = require('../models');

const casoIndiceService = {
  /**
   * Crear nuevo caso índice
   */
  async create(casoData, userId) {
    // Generar código de caso si no se proporciona o está vacío
    if (!casoData.codigo_caso || casoData.codigo_caso.trim() === '') {
      const year = new Date().getFullYear();
      const count = await this.getNextCaseNumber(year);
      casoData.codigo_caso = `CI-${year}-${String(count).padStart(3, '0')}`;
    } else {
      // Si se proporciona, limpiar espacios
      casoData.codigo_caso = casoData.codigo_caso.trim();
    }

    // Verificar que el código no exista
    const existing = await casoIndiceRepository.findByCodigo(casoData.codigo_caso);
    if (existing) {
      throw new Error('El código de caso ya existe');
    }

    // Limpiar campos opcionales vacíos (convertirlos a null para que Sequelize los maneje correctamente)
    if (casoData.paciente_dni && casoData.paciente_dni.trim() === '') {
      casoData.paciente_dni = null;
    }
    if (casoData.observaciones && casoData.observaciones.trim() === '') {
      casoData.observaciones = null;
    }

    // Función helper para normalizar fechas a formato YYYY-MM-DD
    const normalizeDate = (dateValue) => {
      if (!dateValue) return null;
      
      // Si ya es un string en formato YYYY-MM-DD, retornarlo directamente
      if (typeof dateValue === 'string') {
        // Extraer solo la parte de la fecha (YYYY-MM-DD) si viene con tiempo
        const datePart = dateValue.split('T')[0].split(' ')[0];
        // Validar formato YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
          return datePart;
        }
      }
      
      // Si es un objeto Date, convertir a string YYYY-MM-DD usando la fecha local (no UTC)
      if (dateValue instanceof Date) {
        const year = dateValue.getFullYear();
        const month = String(dateValue.getMonth() + 1).padStart(2, '0');
        const day = String(dateValue.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      
      return dateValue;
    };

    // Normalizar fechas antes de guardar
    if (casoData.fecha_diagnostico) {
      casoData.fecha_diagnostico = normalizeDate(casoData.fecha_diagnostico);
    }
    
    if (casoData.fecha_nacimiento) {
      casoData.fecha_nacimiento = normalizeDate(casoData.fecha_nacimiento);
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

    // Función helper para normalizar fechas a formato YYYY-MM-DD
    const normalizeDate = (dateValue) => {
      if (!dateValue) return null;
      
      // Si ya es un string en formato YYYY-MM-DD, retornarlo directamente
      if (typeof dateValue === 'string') {
        // Extraer solo la parte de la fecha (YYYY-MM-DD) si viene con tiempo
        const datePart = dateValue.split('T')[0].split(' ')[0];
        // Validar formato YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
          return datePart;
        }
      }
      
      // Si es un objeto Date, convertir a string YYYY-MM-DD usando la fecha local (no UTC)
      if (dateValue instanceof Date) {
        const year = dateValue.getFullYear();
        const month = String(dateValue.getMonth() + 1).padStart(2, '0');
        const day = String(dateValue.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      
      return dateValue;
    };

    // Normalizar fechas antes de actualizar
    if (casoData.fecha_diagnostico) {
      casoData.fecha_diagnostico = normalizeDate(casoData.fecha_diagnostico);
    }
    
    if (casoData.fecha_nacimiento) {
      casoData.fecha_nacimiento = normalizeDate(casoData.fecha_nacimiento);
    }

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
