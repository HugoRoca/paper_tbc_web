import api from './api'

export const dashboardService = {
  // Obtener total de casos índice
  getTotalCasosIndice: async () => {
    try {
      const response = await api.get('/casos-indice', {
        params: {
          page: 1,
          limit: 1, // Solo necesitamos el total de la paginación
        },
      })
      console.log('getTotalCasosIndice response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error en getTotalCasosIndice:', error)
      throw error
    }
  },

  // Obtener total de contactos
  getTotalContactos: async () => {
    try {
      const response = await api.get('/contactos', {
        params: {
          page: 1,
          limit: 1, // Solo necesitamos el total de la paginación
        },
      })
      console.log('getTotalContactos response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error en getTotalContactos:', error)
      throw error
    }
  },

  // Obtener controles pendientes
  getControlesPendientes: async () => {
    try {
      const response = await api.get('/controles-contacto', {
        params: {
          estado: 'pendiente',
          page: 1,
          limit: 1, // Solo necesitamos el total
        },
      })
      console.log('getControlesPendientes response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error en getControlesPendientes:', error)
      throw error
    }
  },

  // Obtener TPT iniciados
  getTptIniciados: async () => {
    try {
      const response = await api.get('/tpt-indicaciones', {
        params: {
          estado: 'iniciado',
          page: 1,
          limit: 1, // Solo necesitamos el total
        },
      })
      console.log('getTptIniciados response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error en getTptIniciados:', error)
      throw error
    }
  },

  // Obtener alertas activas
  getAlertasActivas: async () => {
    try {
      const response = await api.get('/alertas/activas')
      console.log('getAlertasActivas response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error en getAlertasActivas:', error)
      throw error
    }
  },

  // Obtener derivaciones pendientes
  getDerivacionesPendientes: async () => {
    try {
      const response = await api.get('/derivaciones-transferencias', {
        params: {
          estado: 'pendiente',
          page: 1,
          limit: 10, // Mostrar las primeras 10
        },
      })
      console.log('getDerivacionesPendientes response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error en getDerivacionesPendientes:', error)
      throw error
    }
  },
}
