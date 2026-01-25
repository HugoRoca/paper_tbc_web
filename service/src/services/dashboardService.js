const { sequelize, CasoIndice, Contacto, ControlContacto, TptIndicacion, Alerta } = require('../models');

const dashboardService = {
  /**
   * Obtener estadísticas generales
   */
  async getStats() {
    try {
      const [
        totalCasos,
        totalContactos,
        controlesPendientes,
        tptIniciados,
        alertasActivas,
        derivacionesPendientes
      ] = await Promise.all([
        CasoIndice.count({ where: {} }),
        Contacto.count({ where: {} }),
        ControlContacto.count({ where: { estado: 'Pendiente' } }),
        TptIndicacion.count({ where: { estado: 'Iniciado' } }),
        Alerta.count({ where: { estado: 'Activa' } }),
        sequelize.query(
          `SELECT COUNT(*) as total FROM derivaciones_transferencias WHERE estado = 'Pendiente'`,
          { type: sequelize.QueryTypes.SELECT }
        )
      ]);

      return {
        totalCasos: totalCasos || 0,
        totalContactos: totalContactos || 0,
        controlesPendientes: controlesPendientes || 0,
        tptIniciados: tptIniciados || 0,
        alertasActivas: alertasActivas || 0,
        derivacionesPendientes: derivacionesPendientes[0]?.total || 0
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  },

  /**
   * Distribución de casos por tipo de TB
   */
  async getCasosPorTipo() {
    try {
      const results = await sequelize.query(
        `SELECT tipo_tb, COUNT(*) as cantidad 
         FROM casos_indice 
         GROUP BY tipo_tb 
         ORDER BY cantidad DESC`,
        { type: sequelize.QueryTypes.SELECT }
      );

      return results.map(row => ({
        name: row.tipo_tb || 'No especificado',
        value: parseInt(row.cantidad) || 0
      }));
    } catch (error) {
      throw new Error(`Error al obtener casos por tipo: ${error.message}`);
    }
  },

  /**
   * Casos registrados por mes
   */
  async getCasosPorMes(meses = 6) {
    try {
      const results = await sequelize.query(
        `SELECT 
          DATE_FORMAT(fecha_diagnostico, '%Y-%m') as mes,
          COUNT(*) as cantidad
         FROM casos_indice
         WHERE fecha_diagnostico >= DATE_SUB(CURDATE(), INTERVAL :meses MONTH)
         GROUP BY DATE_FORMAT(fecha_diagnostico, '%Y-%m')
         ORDER BY mes ASC`,
        {
          replacements: { meses },
          type: sequelize.QueryTypes.SELECT
        }
      );

      return results.map(row => ({
        mes: row.mes,
        cantidad: parseInt(row.cantidad) || 0
      }));
    } catch (error) {
      throw new Error(`Error al obtener casos por mes: ${error.message}`);
    }
  },

  /**
   * Distribución de contactos por tipo
   */
  async getContactosPorTipo() {
    try {
      const results = await sequelize.query(
        `SELECT tipo_contacto, COUNT(*) as cantidad 
         FROM contactos 
         GROUP BY tipo_contacto 
         ORDER BY cantidad DESC`,
        { type: sequelize.QueryTypes.SELECT }
      );

      return results.map(row => ({
        name: row.tipo_contacto || 'No especificado',
        value: parseInt(row.cantidad) || 0
      }));
    } catch (error) {
      throw new Error(`Error al obtener contactos por tipo: ${error.message}`);
    }
  },

  /**
   * Distribución de TPT por estado
   */
  async getTptPorEstado() {
    try {
      const results = await sequelize.query(
        `SELECT estado, COUNT(*) as cantidad 
         FROM tpt_indicaciones 
         GROUP BY estado 
         ORDER BY cantidad DESC`,
        { type: sequelize.QueryTypes.SELECT }
      );

      return results.map(row => ({
        name: row.estado || 'No especificado',
        value: parseInt(row.cantidad) || 0
      }));
    } catch (error) {
      throw new Error(`Error al obtener TPT por estado: ${error.message}`);
    }
  },

  /**
   * Distribución de controles por estado
   */
  async getControlesPorEstado() {
    try {
      const results = await sequelize.query(
        `SELECT estado, COUNT(*) as cantidad 
         FROM controles_contacto 
         GROUP BY estado 
         ORDER BY cantidad DESC`,
        { type: sequelize.QueryTypes.SELECT }
      );

      return results.map(row => ({
        name: row.estado || 'No especificado',
        value: parseInt(row.cantidad) || 0
      }));
    } catch (error) {
      throw new Error(`Error al obtener controles por estado: ${error.message}`);
    }
  },

  /**
   * Distribución de alertas por severidad
   */
  async getAlertasPorSeveridad() {
    try {
      const results = await sequelize.query(
        `SELECT severidad, COUNT(*) as cantidad 
         FROM alertas 
         WHERE estado = 'Activa'
         GROUP BY severidad 
         ORDER BY cantidad DESC`,
        { type: sequelize.QueryTypes.SELECT }
      );

      return results.map(row => ({
        name: row.severidad || 'No especificado',
        value: parseInt(row.cantidad) || 0
      }));
    } catch (error) {
      throw new Error(`Error al obtener alertas por severidad: ${error.message}`);
    }
  }
};

module.exports = dashboardService;
