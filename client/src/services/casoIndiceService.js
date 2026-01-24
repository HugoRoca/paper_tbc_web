import api from './api'

export const casoIndiceService = {
  // Listar casos índice con paginación y filtros
  list: async (params = {}) => {
    const response = await api.get('/casos-indice', { params })
    return response.data
  },

  // Obtener caso índice por ID
  getById: async (id) => {
    const response = await api.get(`/casos-indice/${id}`)
    return response.data
  },

  // Crear nuevo caso índice
  create: async (data) => {
    const response = await api.post('/casos-indice', data)
    return response.data
  },

  // Actualizar caso índice
  update: async (id, data) => {
    const response = await api.put(`/casos-indice/${id}`, data)
    return response.data
  },

  // Eliminar caso índice (soft delete)
  delete: async (id) => {
    const response = await api.delete(`/casos-indice/${id}`)
    return response.data
  },
}
