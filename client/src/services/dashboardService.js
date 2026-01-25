import api from './api'

export const dashboardService = {
  // Obtener estadísticas generales
  getStats: async () => {
    const response = await api.get('/dashboard/stats')
    return response.data
  },

  // Obtener distribución de casos por tipo de TB
  getCasosPorTipo: async () => {
    const response = await api.get('/dashboard/casos-por-tipo')
    return response.data
  },

  // Obtener casos por mes
  getCasosPorMes: async (meses = 6) => {
    const response = await api.get('/dashboard/casos-por-mes', {
      params: { meses }
    })
    return response.data
  },

  // Obtener distribución de contactos por tipo
  getContactosPorTipo: async () => {
    const response = await api.get('/dashboard/contactos-por-tipo')
    return response.data
  },

  // Obtener distribución de TPT por estado
  getTptPorEstado: async () => {
    const response = await api.get('/dashboard/tpt-por-estado')
    return response.data
  },

  // Obtener distribución de controles por estado
  getControlesPorEstado: async () => {
    const response = await api.get('/dashboard/controles-por-estado')
    return response.data
  },

  // Obtener distribución de alertas por severidad
  getAlertasPorSeveridad: async () => {
    const response = await api.get('/dashboard/alertas-por-severidad')
    return response.data
  },

  // Obtener alertas activas
  getAlertasActivas: async () => {
    const response = await api.get('/alertas/activas')
    return response.data
  },

  // Obtener derivaciones pendientes
  getDerivacionesPendientes: async () => {
    const response = await api.get('/derivaciones-transferencias', {
      params: {
        estado: 'pendiente',
        page: 1,
        limit: 10,
      },
    })
    return response.data
  },
}
