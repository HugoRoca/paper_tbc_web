import api from './api'

export const establecimientoSaludService = {
  // Listar establecimientos (para filtros y selectores)
  list: async (params = {}) => {
    const response = await api.get('/establecimientos-salud', { params })
    return response.data
  },

  // Obtener establecimiento por ID
  getById: async (id) => {
    const response = await api.get(`/establecimientos-salud/${id}`)
    return response.data
  },
}
