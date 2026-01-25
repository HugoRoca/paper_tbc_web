import api from './api'

export const alertaService = {
  list: async (params = {}) => {
    const response = await api.get('/alertas', { params })
    return response.data
  },

  getActivas: async (params = {}) => {
    const response = await api.get('/alertas/activas', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/alertas/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/alertas', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/alertas/${id}`, data)
    return response.data
  },

  resolver: async (id, data) => {
    const response = await api.put(`/alertas/${id}/resolver`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/alertas/${id}`)
    return response.data
  },
}
