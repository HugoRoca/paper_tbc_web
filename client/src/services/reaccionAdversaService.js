import api from './api'

export const reaccionAdversaService = {
  list: async (params = {}) => {
    const response = await api.get('/reacciones-adversas', { params })
    return response.data
  },

  getByTptIndicacion: async (tptIndicacionId) => {
    const response = await api.get(`/reacciones-adversas/tpt-indicacion/${tptIndicacionId}`)
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/reacciones-adversas/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/reacciones-adversas', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/reacciones-adversas/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/reacciones-adversas/${id}`)
    return response.data
  },
}
