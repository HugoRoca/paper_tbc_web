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

  // Crear establecimiento
  create: async (data) => {
    const response = await api.post('/establecimientos-salud', data)
    return response.data
  },

  // Actualizar establecimiento
  update: async (id, data) => {
    const response = await api.put(`/establecimientos-salud/${id}`, data)
    return response.data
  },

  // Eliminar establecimiento
  delete: async (id) => {
    const response = await api.delete(`/establecimientos-salud/${id}`)
    return response.data
  },
}
